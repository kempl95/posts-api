export class DatabaseResultDTO {
  result: string;

  constructor(partial: Partial<DatabaseResultDTO>) {
    Object.assign(this, partial);
  }
}
