import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";

import { map, catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};


@Injectable({
  providedIn: 'root'
})
export class ZabbixService {

  private url = "http://10.71.35.221/zabbix/api_jsonrpc.php";
  private authToken: string = '';

  constructor(private _http: HttpClient) { }

  async authenticate(): Promise<any> {
    const body = {
      jsonrpc: '2.0',
      method: 'user.login',
      params: {
        username: "DCP_soporte",
        password: "Totalplay123",
        // password: "Syee-2008/1",
      },
      id: 1
      // auth: null
    };
    return this._http.post<any>(this.url, body).toPromise();

  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async getItem(hostid: any, tagValue: any): Promise<any> {
    let obj = {
      "jsonrpc": "2.0",
      "method": "item.get",
      "params": {
        "output": ["name"],
        "hostids": hostid,
        "tags": [
          {
              "tag": "ROUTER",
              "value": tagValue
          }
        ]
      },
      "auth": this.authToken,
      "id": 1
    };
    return this._http.post<any>(this.url, obj).toPromise();
  }

  async getItemInterface(hostid: any, tagValue: any): Promise<any> {
    let obj = {
      "jsonrpc": "2.0",
      "method": "item.get",
      "params": {
        "output": "extend",
        "hostids": hostid,
        "tags": [
          {
              "tag": "interface",
              "value": tagValue,
              "operator": 1
          }
        ]
      },
      "auth": this.authToken,
      "id": 1
    };
    return this._http.post<any>(this.url, obj).toPromise();
  }

  async getHost(hostid: any): Promise<any> {
    let obj = {
      "jsonrpc": "2.0",
      "method": "host.get",
      "params": {
        "output": "extend",
        "hostids": hostid,
        "selectInterfaces": ["interfaceid", "ip", "dns", "useip"]
      },
      "auth": this.authToken,
      "id": 1
    };
    return this._http.post<any>(this.url, obj).toPromise();

  }

  async getProblems(hostid: any, tagValue: any): Promise<any>{
    let obj = {
      "jsonrpc": "2.0",
      "method": "problem.get",
      "params": {
        "output": "extend",
        "hostids": hostid,
        "tags": [
          {
              "tag": "interface",
              "value": tagValue
          }
        ]
      },
      "auth": this.authToken,
      "id": 1
    };
    return this._http.post<any>(this.url, obj).toPromise();
  }

  /***************************************************************************************************/
  /************************************ DATAHUB ******************************************************/
  /***************************************************************************************************/

  async getDevice (): Promise<any> {
    return this._http.get<any>("http://10.71.46.24:8084/hexa/api/device").toPromise();
  }

  async getIsp (): Promise<any> {
    return this._http.get<any>("http://10.71.46.24:8084/hexa/api/isp").toPromise();
  }

  async getPeering (): Promise<any> {
    return this._http.get<any>("http://10.71.46.24:8084/hexa/api/peering").toPromise();
  }

  async getTicket (): Promise<any> {
    return this._http.get<any>("http://10.71.46.24:8084/hexa/api/ticket").toPromise();
  }

}
