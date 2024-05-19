import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import csvToJson from 'csvtojson';
import {
    API_URL,
    DEFAULT_FIELDS,
    DEFAULT_LIMIT,
    DEFAULT_OFFSET,
    DEFAULT_SORT_DIR,
} from '../../../shared/constants';
import {
    FieldsEnum,
    ListMobileFoodQuery,
    MobileFoodResponse,
} from '../models/mobile-food.model';

@Injectable()
export class MobileFoodService {
    private api: AxiosInstance;
    constructor() {
        this.api = axios.create();
    }

    async list(query: ListMobileFoodQuery): Promise<Array<MobileFoodResponse>> {
        const filter = query?.filter;
        let fields = DEFAULT_FIELDS;
        if (query?.fields) {
            fields = this.formatAndValidateFields(fields, query.fields);
        }
        const limit = query?.limit || DEFAULT_LIMIT;
        const offset = query?.offset || DEFAULT_OFFSET;
        const sortDir = query?.sortDir || DEFAULT_SORT_DIR;
        let response: MobileFoodResponse[];
        let json: MobileFoodResponse[];

        // 1. Request & format data
        json = await this.requestData();

        // 2. Filter
        response = this.filterResults(filter, json);

        // 3. Sort
        response = this.sortResults(sortDir, response);

        // 4. Paginate
        response = this.paginateResults(limit, offset, response);

        // 5. Add Google Maps url
        response = this.addGoogleMapsUrl(response);

        // 6. Response validation
        response = this.validateResponseFields(fields, response);

        return response;
    }

    async getByLocationId(locationId: string): Promise<MobileFoodResponse> {
        // 1. Request & format data
        const json = await this.requestData();

        // 2. Lower case the keys
        const formattedJson = this.keysToLowerCase(json);

        // 3. Grab the record with a matching locationId
        let response = formattedJson.find(
            (obj: any) => obj.locationid === locationId
        );

        if (!response) {
            throw new NotFoundException(
                `Mobile Food data with locationId ${locationId} cannot be found.`
            );
        }

        // 4. Add Google Maps url
        response = this.addGoogleMapsUrl(response)[0];

        // 5. Response validation
        response = this.validateResponseFields(
            Object.keys(FieldsEnum),
            response
        )[0];

        return response;
    }

    private async requestData() {
        try {
            const result = await this.api.get(API_URL);
            const data = await csvToJson().fromString(result.data);
            const jsonString = JSON.stringify(data, null, 2);
            return JSON.parse(jsonString);
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    private formatAndValidateFields(fields: string[], queryFields: string) {
        const formattedFields = queryFields.split(',');
        const validatedFields = formattedFields.filter((field: string) =>
            Object.keys(FieldsEnum).includes(field.toLowerCase())
        );
        return [...fields, ...validatedFields];
    }

    private keysToLowerCase(json: any) {
        return Array.isArray(json)
            ? json.reduce(
                  (accum: MobileFoodResponse[], curr: MobileFoodResponse) => {
                      accum.push(this.keysToLowerCase(curr));
                      return accum;
                  },
                  []
              )
            : Object.keys(json).reduce(function (newObj: any, key: string) {
                  let formattedKey = key;
                  if (key?.indexOf(' ') >= 0) {
                      formattedKey = key.split(' ').join('');
                  }
                  newObj[formattedKey.toLowerCase()] = json[key];
                  return newObj;
              }, {});
    }

    private filterResults(filter: string, json: Array<MobileFoodResponse>) {
        // filter by applicant, foodItems, status, facilityType, and excludeExpired
        return json.reduce(
            (accum: MobileFoodResponse[], curr: MobileFoodResponse) => {
                const mobileFoodRecord = this.keysToLowerCase(curr);
                let statusFilter;
                let facilityTypeFilter;
                let excludeExpiredFilter = false;
                let parsedFilter;

                try {
                    parsedFilter = filter && JSON.parse(filter);
                } catch (err) {
                    // catch the error to prevent failure, possibly log the error for investigation
                }

                const formattedFilter =
                    parsedFilter && this.keysToLowerCase(parsedFilter);

                if (formattedFilter?.status) {
                    statusFilter = formattedFilter.status.toLowerCase();
                }

                if (formattedFilter?.facilitytype) {
                    facilityTypeFilter =
                        formattedFilter.facilitytype.toLowerCase();
                }

                if (formattedFilter?.excludeExpired) {
                    excludeExpiredFilter = true;
                }

                const applicantFilter = formattedFilter?.applicant
                    ? new RegExp(formattedFilter.applicant.toLowerCase()).test(
                          mobileFoodRecord.applicant.toLowerCase()
                      )
                    : true;

                const foodItemsFilter = formattedFilter?.foodItems
                    ? new RegExp(formattedFilter.foodItems.toLowerCase()).test(
                          mobileFoodRecord.fooditems.toLowerCase()
                      )
                    : true;

                let shouldExclude = false;
                if (excludeExpiredFilter) {
                    try {
                        const expirationDate =
                            formattedFilter?.expirationDate &&
                            new Date(formattedFilter.expirationDate);
                        shouldExclude = expirationDate >= new Date();
                    } catch (err) {
                        // catch the error to prevent failure, exclude it if invalid or no expiration date
                        shouldExclude = true;
                    }
                }

                const statusCheck = statusFilter
                    ? mobileFoodRecord.status?.toLowerCase() === statusFilter
                    : true;

                const facilityTypeCheck = facilityTypeFilter
                    ? mobileFoodRecord.facilitytype?.toLowerCase() ===
                      facilityTypeFilter
                    : true;

                if (
                    statusCheck &&
                    facilityTypeCheck &&
                    applicantFilter &&
                    foodItemsFilter &&
                    (!excludeExpiredFilter ? true : shouldExclude)
                ) {
                    accum.push(mobileFoodRecord);
                }

                return accum;
            },
            []
        );
    }

    private sortResults(sortDir: string, json: Array<MobileFoodResponse>) {
        return json.sort((a: MobileFoodResponse, b: MobileFoodResponse) => {
            if (sortDir === DEFAULT_SORT_DIR) {
                if (a.applicant > b.applicant) {
                    return 1;
                }
                return -1;
            }

            if (a.applicant < b.applicant) {
                return 1;
            }
            return -1;
        });
    }

    private paginateResults(
        limit: number,
        offset: number,
        json: Array<MobileFoodResponse>
    ) {
        if (offset > 0) {
            json = json.slice(offset);
        }

        if (limit > 0) {
            json = json.slice(0, limit);
        }

        return json;
    }

    private validateResponseFields(
        fields: Array<string>,
        json: MobileFoodResponse | Array<MobileFoodResponse>
    ) {
        const formattedFields = fields.map((field) => field.toLowerCase());
        const formattedJson = Array.isArray(json) ? json : [json];
        return formattedJson.map((obj: any) =>
            Object.fromEntries(
                formattedFields
                    .map(
                        (key: string) =>
                            obj.hasOwnProperty(key) && [key, obj[key]]
                    )
                    .filter(Boolean)
            )
        );
    }

    private addGoogleMapsUrl(json: Array<MobileFoodResponse>) {
        const formattedJson = Array.isArray(json) ? json : [json];
        return formattedJson.map((mobileFoodRecord) => {
            mobileFoodRecord.googlemapsurl = `http://maps.google.com/maps?z=12&t=m&q=loc:${mobileFoodRecord.latitude}+${mobileFoodRecord.longitude}`;
            return mobileFoodRecord;
        });
    }
}
