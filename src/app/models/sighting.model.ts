import { Timestamp } from 'rxjs';

export class Sighting  {

    sighting_number: number;

    date_time?: Date;

    user: string;

    temperature: string;

    adult_male: number;

    adult_female: number;

    adult_id_list: Array<string>;

    sub_adult_male: number;

    sub_adult_female: number;

    sub_adult_id_list: Array<string>;

    cub_male: number;

    cub_female: number;

    cub_unknown: number;

    cub_id_list: Array<string>;

    latitude: number;

    longitude: number;

    activity: string;

    catch: boolean;

    catch_species?: string;

    catch_gender?: string;

    catch_age?: string;

    carcass_utilization?: number;

    comments?: string;

    photos?: Array<string>;
}
