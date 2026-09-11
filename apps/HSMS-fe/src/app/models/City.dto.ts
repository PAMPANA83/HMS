export interface CityMastersDto {
  id: number;
  stateId: number;
  stateName: string;
  name: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
}


export interface CreateCityDto {
   stateId: number;
  name: string;
  postalCode: string;
}
