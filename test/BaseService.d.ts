//
// Autogenerated by Thrift Compiler (0.9.3)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//


declare class BaseServiceClient {
  input: Thrift.TJSONProtocol;
  output: Thrift.TJSONProtocol;
  seqid: number;

  constructor(input: Thrift.TJSONProtocol, output?: Thrift.TJSONProtocol);

  listProvinces(hasDevice: boolean): Province[];

  listProvinces(hasDevice: boolean, callback: Function): void;

  listCities(hasDevice: boolean): City[];

  listCities(hasDevice: boolean, callback: Function): void;

  listCitiesByCityIds(cityIds: string[], hasDevice: boolean): City[];

  listCitiesByCityIds(cityIds: string[], hasDevice: boolean, callback: Function): void;

  listCitiesByProvince(provinceId: string, hasDevice: boolean): City[];

  listCitiesByProvince(provinceId: string, hasDevice: boolean, callback: Function): void;

  listRegionsByCity(cityId: string, hasDevice: boolean): Region[];

  listRegionsByCity(cityId: string, hasDevice: boolean, callback: Function): void;

  listAreas(hasDevice: boolean): AreaItem[];

  listAreas(hasDevice: boolean, callback: Function): void;

  getParamValue(paramName: string, type: string, defaultLabel: string): string;

  getParamValue(paramName: string, type: string, defaultLabel: string, callback: Function): void;

  getTerminalById(terminalId: string): Terminal;

  getTerminalById(terminalId: string, callback: Function): void;

  getAreaList(areaIds: string[]): { [k: string]: Area; };

  getAreaList(areaIds: string[], callback: Function): void;

  getSysParamsByParamType(paramType: string): { [k: string]: string; };

  getSysParamsByParamType(paramType: string, callback: Function): void;

  getArea(areaId: string): Area;

  getArea(areaId: string, callback: Function): void;
}