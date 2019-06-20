export interface ILaboratoire {
  id?: number;
  laboratoireRaisSoc?: string;
  laboratoireAdresse?: string;
  laboratoireTelephone?: number;
}

export class Laboratoire implements ILaboratoire {
  constructor(
    public id?: number,
    public laboratoireRaisSoc?: string,
    public laboratoireAdresse?: string,
    public laboratoireTelephone?: number
  ) {}
}
