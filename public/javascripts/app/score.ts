export class Score {

  constructor(
    public playerid: number,
    public fixtureid: number,
    public date: string,
    public runs : number,
    public battingscore: number,
    public wickets : number,
    public bowlingscore: number,
    public catches : number,
    public runouts : number,
    public fieldingscore: number,
    public mom : number,
    public totalscore: number
  ) {  }

}