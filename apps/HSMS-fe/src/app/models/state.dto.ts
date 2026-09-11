// src/models/state.dto.ts
export interface StateMastersDto {
   id: number;
  countryId: number;
  countryName: string;
  name: string;
  stateCode: string;
  createdAt: string;
  updatedAt: string;
}


export interface CreateStateMasters {  
           // string? stateID  
  stateName?: string;            // string? StateName
  stateCode?: string;            // int? StateCode
  countryID?: number;            // int? CountryID
  
}

export interface UpdateStateMasters {
   id?: number;               // string? stateID  
  stateName?: string;            // string? StateName
  stateCode?: string;            // int? StateCode
  countryID?: number;            // int? CountryID
  
}
