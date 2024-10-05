import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ZabbixService } from './services/zabbix.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var vis: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hexa';

  @ViewChild("siteConfigNetwork", { static: true }) networkContainer: ElementRef;
  @ViewChild('content') private modalContent: any;

  page = 1;
  pageSize = 4;
  collectionSize = 10;

  public network: any;
  arrHostDime: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_hostdime_qro': '',
    'interfaces_hostdime_tlaquepque': '',
    'problemas_enlace_qro': '',
    'problemas_enlace_tlaquepaque': '',
    'color_problemas_isp': '',
    'color_problemas_arista_hostdime': '',
    'color_problemas_hostdime_tlaquepaque': '',
    'color_problemas_hostdime_qro': ''
  }];
  arrBuenosAires: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_ba_qro': '',
    'interfaces_ba_kiomty': '',
    'problemas_enlace_qro': '',
    'problemas_enlace_kiomty': '',
    'color_problemas_ba_kiomty': '',
    'color_problemas_isp_ba': '',
    'color_problemas_ba_arista': '',
    'color_problemas_ba_qro': ''
  }];
  arrKioMty: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_mty_qro': '',
    'interfaces_mty_arista': '',
    'problemas_enlace_qro': '',
    'problemas_enlace_tlaquepaque': '',
    'problemas_enlace_arista': '',
    'color_problemas_isp': '',
    'color_problemas_mty_qro': '',
    'color_problemas_mty_arista': '',
  }];

  arrTlaquepaque: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_tlaquepaque_qro': '',
    'interfaces_tlaquepaque_arista': '',
    'problemas_enlace_qro': 2,
    'problemas_enlace_arista': '',
    'color_problemas_isp': '',
    'color_problemas_tlaquepaque_qro': '',
    'color_problemas_tlaquepaque_arista': ''
  }];
  arrChurubusco: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_churubusco_qro': '',
    'interfaces_churubusco_arista': '',
    'problemas_enlace_qro': '',
    'problemas_enlace_arista': '',
    'color_problemas_isp': '',
    'color_problemas_churubusco_arista': '',
    'color_problemas_churubusco_qro': ''
  }];
  arrTlalnepantla: any = [{
    'interfaces': '',
    'interfaces_isp': '',
    'ancho_banda_total': '',
    'ancho_banda_total_isp': '',
    'host': '',
    'problemas_isp': '',
    'problemas_enlace': '',
    'interfaces_problema_isp': '',
    'interfaces_problema': '',
    'interfaces_tlalnepantla_qro': '',
    'interfaces_tlalnepantla_churubusco': '',
    'interfaces_tlalnepantla_arista': '',
    'problemas_enlace_qro': '',
    'problemas_enlace_churubusco': '',
    'problemas_enlace_arista': '',
    'color_problemas_isp': '',
    'color_problemas_tlalnepantla_qro': '',
    'color_problemas_tlalnepantla_arista': '',
    'color_problemas_tlalnepantla_churubusco': ''
  }];

  arrArista: any = [{
    'interfaces_peerings': '',
    'problemas_peerings': '',
    'ancho_banda_total': '',
    'host': ''
  }];

  arrKioQro: any = [{
    'interfaces_peerings': '',
    'problemas_peerings': '',
    'ancho_banda_total': '',
    'host': ''
  }];

  arrDevices: any = [];
  arrIsp: any = [];
  arrPeerings: any = [];
  arrTickets: any = [];
  arrModalPeerings: any = [];
  arrModalPeeringsKioQro: any = [];
  arrModalPeeringsTemp: any = [];
  arrModalPeeringsTempKioQro: any = [];


  constructor(
    private zabbixService: ZabbixService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    var treeData = this.getTreeData();
    this.loadVisTree(treeData);     // RENDER STANDARD NODES WITH TEXT LABEL
    await this.arista();
    await this.kioqro();
    await this.getZabbixData();
    setInterval(async () => {
      console.log("getZabbixData");
      await this.getZabbixData();
    }, 300000);

  }

  loadVisTree(treedata: any) {
    var options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      interaction: {
        hover: true,
        zoomView: false,
      },
      manipulation: {
        enabled: false,
      },
      edges: {
        width: 2,
        color: {
          color: "#6b6b6b",
          hover: "#6b6b6b",
        },
      },
      nodes: {
        font: { color: "#b3b300" },
        borderWidth: 0,
        fixed: true,
        color: {
          hover: { background: "#000000", border: "#000000" }
          // border: "#406897",
          // background: "#6AAFFF",
        },
        shapeProperties: {
          useBorderWithImage: true,
        },
      },
      layout: {
        randomSeed: 0,
        hierarchical: {
          enabled: false,
          direction: "UD",
        },
      },
    };
    var container = this.networkContainer.nativeElement;
    this.network = new vis.Network(container, treedata, options);

    this.network.moveTo({
      scale: 0.3             // Zooms out; 1 is no zoom
    });

    var that = this;
    this.network.on("hoverNode", function (params: any) {
      console.log('hoverNode Event:', params);
    });
    this.network.on("blurNode", function (params: any) {
      console.log('blurNode event:', params);
    });

    this.network.on("click", (params: any) => {
      console.log('click event:', params);
      var edgeIds = params.edges;
      var nodeIds = params.nodes;
      console.log('edge ids:', edgeIds);
      console.log('arrModalPeerings', this.arrModalPeerings);

      if (nodeIds == 1) {
        this.collectionSize = this.arrModalPeerings.length;
        this.arrModalPeeringsTemp = this.arrModalPeerings;
        // Abro modal con detalles de perrings
        this.modalService.open(this.modalContent, {
          size: "xl",
          centered: true,
          scrollable: true,
          backdrop: "static",
          keyboard: false,
        });
      } else if (nodeIds == 4) {
        this.collectionSize = this.arrModalPeeringsKioQro.length;
        this.arrModalPeeringsTemp = this.arrModalPeeringsKioQro;
        // Abro modal con detalles de perrings
        this.modalService.open(this.modalContent, {
          size: "xl",
          centered: true,
          scrollable: true,
          backdrop: "static",
          keyboard: false,
        });
      }

    });

    // this.network.moveTo({
    //   position: { x: 300, y: 300 },    // position to animate to (Numbers)
    //   scale: 0.5,              // scale to animate to  (Number)
    //   offset: { x: 0, y: 0 },      // offset from the center in DOM pixels (Numbers)
    //   animation: {             // animation object, can also be Boolean
    //     duration: 1000,                 // animation duration in milliseconds (Number)
    //     easingFunction: "easeInOutQuad" // Animation easing function, available are:
    //   }                                   // linear, easeInQuad, easeOutQuad, easeInOutQuad,
    // });


  }

  async getZabbixData() {

    // Devices
    const device = await this.zabbixService.getDevice();
    console.log('device', device);

    // ISP´s
    const isp = await this.zabbixService.getIsp();
    console.log('isp', isp);

    // Peerings
    const peering = await this.zabbixService.getPeering();
    console.log('peering', peering);

    const authResponse = await this.zabbixService.authenticate();
    this.zabbixService.setAuthToken(authResponse.result);
    console.log(authResponse.result);

    /*****************************************************************************/
    /*****************************************************************************/
    // HostDime
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_hostdime = await this.zabbixService.getItem(14105, 'HOSTDIME');
    console.log(interfaces_hostdime.result);

    let txtInterfaces = '<table class="table table-striped">';
    let txtInterfaces_hostdime_tlaquepaque = '<table class="table table-striped">';
    let txtInterfaces_hostdime_qro = '<table class="table table-striped">';
    let txtInterfaces_isp = '<table class="table table-striped">';
    let txtInterfacesHostDime_down = '';
    let txtEnlacesHostDime_down = '';
    // interfaces_hostdime.result.forEach(element => {
    //   txtInterfaces = txtInterfaces + element.name.split(':')[0].split('(')[0] + '\n';
    // });

    // let ancho_banda_hostDime = interfaces_hostdime.result.length * 100;
    // let umedida_hostDime = interfaces_hostdime.result.length >= 10 ? 'Tbps' : 'Gbps';
    // Datos Hostdime

    let arr_datos_hostDime = await this.zabbixService.getHost(14105);
    console.log(arr_datos_hostDime);


    // ISP´s
    const isp_hostdime = await isp.filter(x => x.device_name == "POP-HOST-DIME-GDL-NE40-X8A-CA");

    console.log("ISP´s HostDime:", isp_hostdime);
    let ancho_banda_isp_hostDime = isp_hostdime.length >= 10 ? isp_hostdime.length / 10 : isp_hostdime.length * 100;
    let umedida_isp_hostDime = isp_hostdime.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_isp_hostdime = false;
    let totalProblemas_isp = 0;

    let ihd = 0;
    isp_hostdime.forEach(async element => {
      const resp = await this.zabbixService.getItemInterface(14105, element.interface_description);
      console.log('Resp ItemInterface HostDime:', resp);

      const problems = await this.zabbixService.getProblems(14105, element.interface_description);

      if (ihd == 0) {
        txtInterfaces_isp = txtInterfaces_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_hostDime.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      ihd++;
      // txtInterfaces_isp = txtInterfaces_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      if (resp.result.length == 0 || problems.result.length > 0) {
        problemas_isp_hostdime = true;
        totalProblemas_isp++;
        txtInterfaces_isp = txtInterfaces_isp + '<tr><td class="text-danger">' + element.interface_description + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
      } else {
        txtInterfaces_isp = txtInterfaces_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

    });

    // Enlaces Arista-HostDime
    //   const enlace_arista_hostdime = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP-HOST-DIME-GDL-NE40-X8A-CA") ||
    // (x.nombre_equipo_destino == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_origen == "POP-HOST-DIME-GDL-NE40-X8A-CA"));
    const enlace_arista_hostdime = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP-HOST-DIME-GDL-NE40-X8A-CA"));
    console.log("Enlace Arista -> HostDime:", enlace_arista_hostdime);

    // let origen = await enlace_arista_hostdime.filter(x => x.device_name == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE");
    let ancho_banda_hostDime = enlace_arista_hostdime.length >= 10 ? enlace_arista_hostdime.length / 10 : enlace_arista_hostdime.length * 100;
    let umedida_hostDime = enlace_arista_hostdime.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_hostdime = enlace_arista_hostdime.length > 0 ? 0 : 2;
    let totalProblemas_arista_hostdime = 0;
    let ah = 0;
    await enlace_arista_hostdime.forEach(async element => {
      console.log("Enlaces Arista->HostDime: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14105, element.descripcion_interface_origen);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14105, element.descripcion_interface_destino);
      console.log("Resp Interfaces Arista->HostDime: ", respO.result);
      console.log("Resp Interfaces HostDime->Arista: ", respD.result);

      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14105, element.descripcion_interface_origen);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14105, element.descripcion_interface_destino);

      console.log('Problemas enlaces enlace_arista_hostdime:', problems);

      if (ah == 0) {
        txtInterfaces = txtInterfaces + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_hostdime = 1;
        totalProblemas_arista_hostdime++;
        txtInterfaces = txtInterfaces + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      }
      else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_hostdime = 1;
        txtInterfaces = txtInterfaces + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces = txtInterfaces + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }


      // const problems = await this.zabbixService.getProblems(14105, element.descripcion_interface_origen);
      // console.log('Problemas enlaces HostDime:', problems);
      // if (problems.result.length > 0) {
      //   problemas_hostdime = 1;
      //   txtInterfaces = txtInterfaces + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }

      this.arrHostDime[0]['interfaces'] = txtInterfaces + '</tbody></table>';
      this.arrHostDime[0]['interfaces_isp'] = txtInterfaces_isp + '</tbody></table>';
      this.arrHostDime[0]['ancho_banda_total'] = ancho_banda_hostDime + umedida_hostDime + '</tbody></table>';
      this.arrHostDime[0]['ancho_banda_total_isp'] = ancho_banda_isp_hostDime + umedida_isp_hostDime;
      this.arrHostDime[0]['host'] = arr_datos_hostDime.result.length > 0 ? arr_datos_hostDime.result[0].name + '\n' + arr_datos_hostDime.result[0].interfaces[0].ip : '';
      this.arrHostDime[0]['problemas_isp'] = problemas_isp_hostdime;
      this.arrHostDime[0]['problemas_enlace'] = problemas_hostdime;
      this.arrHostDime[0]['interfaces_problema_isp'] = txtInterfacesHostDime_down;
      this.arrHostDime[0]['interfaces_problema'] = txtEnlacesHostDime_down;
      this.arrHostDime[0]['color_problemas_isp'] = problemas_isp_hostdime ? problemas_isp_hostdime == isp_hostdime.length ? '#ff0000' : '#fff200' : '';
      this.arrHostDime[0]['color_problemas_arista_hostdime'] = problemas_hostdime ? totalProblemas_arista_hostdime == enlace_arista_hostdime.length ? '#ff0000' : '#fff200' : '';

      console.log('this.arrHostDime[0]["interfaces"]', this.arrHostDime[0]['interfaces']);
      ah++;
    });

    // Enlaces HostDime-Tlaquepaque
    //   const enlace_hostdime_tlaquepaque = await device.filter(x => (x.nombre_equipo_origen == "POP_TLAQUE-JAL86450-X16A-CA" && x.nombre_equipo_destino == "POP-HOST-DIME-GDL-NE40-X8A-CA") ||
    // (x.nombre_equipo_destino == "POP_TLAQUE-JAL86450-X16A-CA" && x.nombre_equipo_origen == "POP-HOST-DIME-GDL-NE40-X8A-CA"));
    const enlace_hostdime_tlaquepaque = await device.filter(x => (x.nombre_equipo_origen == "POP-HOST-DIME-GDL-NE40-X8A-CA" && x.nombre_equipo_destino == "POP_TLAQUE-JAL86450-X16A-CA"));
    console.log("Enlace HostDime -> Tlaquepaque:", enlace_hostdime_tlaquepaque);

    let ancho_banda_hostDime_tlaquepaque = enlace_hostdime_tlaquepaque.length >= 10 ? enlace_hostdime_tlaquepaque.length / 10 : enlace_hostdime_tlaquepaque.length * 100;
    let umedida_hostDime_tlaquepaque = enlace_hostdime_tlaquepaque.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_hostdime_tlaquepaque = false;
    let totalProblemas_hostdime_tlaquepaque = 0;
    let hdt = 0
    enlace_hostdime_tlaquepaque.forEach(async element => {
      console.log("Enlaces HostDime->Tlquepaque: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14102, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14102, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);
      console.log("Resp Interfaces HostDime->Tlaquepaque: ", respO.result);
      console.log("Resp Interfaces HostDime->HostDime: ", respD.result);
      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14102, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14102, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);

      console.log('Problemas enlaces enlace_hostdime_tlaquepaque:', problems);

      if (hdt == 0) {
        txtInterfaces_hostdime_tlaquepaque = txtInterfaces_hostdime_tlaquepaque + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_hostdime_tlaquepaque = true;
        totalProblemas_hostdime_tlaquepaque++;
        txtInterfaces_hostdime_tlaquepaque = txtInterfaces_hostdime_tlaquepaque + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      }
      else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_hostdime_tlaquepaque = true;
        txtInterfaces_hostdime_tlaquepaque = txtInterfaces_hostdime_tlaquepaque + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_hostdime_tlaquepaque = txtInterfaces_hostdime_tlaquepaque + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }


      // const problems = await this.zabbixService.getProblems(14102, element.descripcion_interface_origen);
      // console.log('Problemas enlaces HostDime -> Tlaquepaque:', problems);
      // if (problems.result.length > 0) {
      //   problemas_hostdime_tlaquepaque = true;
      //   // txtEnlacesHostDime_down = txtEnlacesHostDime_down + '<br>' + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      //   txtInterfaces_hostdime_tlaquepaque = txtInterfaces_hostdime_tlaquepaque + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }

      this.arrHostDime[0]['interfaces'] = txtInterfaces + '</tbody></table>';
      this.arrHostDime[0]['interfaces_isp'] = txtInterfaces_isp + '</tbody></table>';
      this.arrHostDime[0]['interfaces_hostdime_tlaquepque'] = txtInterfaces_hostdime_tlaquepaque + '</tbody></table>';
      this.arrHostDime[0]['ancho_banda_total'] = ancho_banda_hostDime + umedida_hostDime;
      this.arrHostDime[0]['ancho_banda_total_isp'] = ancho_banda_isp_hostDime + umedida_isp_hostDime;
      this.arrHostDime[0]['ancho_banda_total_hostdime_tlaquepaque'] = ancho_banda_hostDime_tlaquepaque + umedida_hostDime_tlaquepaque;
      this.arrHostDime[0]['host'] = arr_datos_hostDime.result.length > 0 ? arr_datos_hostDime.result[0].name + '\n' + arr_datos_hostDime.result[0].interfaces[0].ip : '';
      this.arrHostDime[0]['problemas_isp'] = problemas_isp_hostdime;
      this.arrHostDime[0]['problemas_enlace'] = problemas_hostdime;
      this.arrHostDime[0]['problemas_enlace_tlaquepaque'] = problemas_hostdime_tlaquepaque;
      this.arrHostDime[0]['interfaces_problema_isp'] = txtInterfacesHostDime_down;
      this.arrHostDime[0]['interfaces_problema'] = txtEnlacesHostDime_down;
      this.arrHostDime[0]['color_problemas_hostdime_tlaquepaque'] = problemas_hostdime_tlaquepaque ? totalProblemas_hostdime_tlaquepaque == enlace_hostdime_tlaquepaque.length ? '#ff0000' : '#fff200' : '';

      hdt++;
    });

    // Enlace HostDime -> Kio Qro

    const enlace_hostdime_qro = await device.filter(x => (x.nombre_equipo_origen == "POP-HOST-DIME-GDL-NE40-X8A-CA" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));
    console.log("Enlace HostDime -> Kio QRO:", enlace_hostdime_qro);

    let ancho_banda_hostDime_qro = enlace_hostdime_qro.length >= 10 ? enlace_hostdime_qro.length / 10 : enlace_hostdime_qro.length * 100;
    let umedida_hostDime_qro = enlace_hostdime_qro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_hostdime_qro = false;
    let totalProblemas_hostdime_qro = 0;

    let j = 0;
    let hdq = 0;
    enlace_hostdime_qro.forEach(async element => {
      console.log("Enlaces HostDime->Kio QRO: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);
      console.log("Resp Interfaces HostDime->Kio QRO: ", respO.result);
      console.log("Resp Interfaces Kio QRO->HostDime: ", respD.result);
      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP-HOST-DIME-GDL-NE40-X8A-CA' ? 14105 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);

      console.log('Problemas enlaces enlace_hostdime_qro:', problems);
      if (hdq == 0) {
        txtInterfaces_hostdime_qro = txtInterfaces_hostdime_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_hostdime_qro = true;
        totalProblemas_hostdime_qro++;
        txtInterfaces_hostdime_qro = txtInterfaces_hostdime_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      }
      else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_hostdime_qro = true;
        txtInterfaces_hostdime_qro = txtInterfaces_hostdime_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_hostdime_qro = txtInterfaces_hostdime_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }


      // const problems = await this.zabbixService.getProblems(14104, element.descripcion_interface_origen);
      // console.log('Problemas enlaces HostDime -> Kio QRO:', problems);
      // if (problems.result.length > 0) {
      //   problemas_hostdime_qro = true;
      //   // txtEnlacesHostDime_down = txtEnlacesHostDime_down + '<br>' + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      //   txtInterfaces_hostdime_qro = txtInterfaces_hostdime_qro + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }

      this.arrHostDime[0]['interfaces'] = txtInterfaces;
      this.arrHostDime[0]['interfaces_isp'] = txtInterfaces_isp;
      this.arrHostDime[0]['interfaces_hostdime_tlaquepque'] = txtInterfaces_hostdime_tlaquepaque;
      this.arrHostDime[0]['interfaces_hostdime_qro'] = txtInterfaces_hostdime_qro;
      this.arrHostDime[0]['ancho_banda_total'] = ancho_banda_hostDime + umedida_hostDime;
      this.arrHostDime[0]['ancho_banda_total_isp'] = ancho_banda_isp_hostDime + umedida_isp_hostDime;
      this.arrHostDime[0]['ancho_banda_total_hostdime_tlaquepaque'] = ancho_banda_hostDime_tlaquepaque + umedida_hostDime_tlaquepaque;
      this.arrHostDime[0]['ancho_banda_total_hostdime_qro'] = ancho_banda_hostDime_qro + umedida_hostDime_qro;
      this.arrHostDime[0]['host'] = arr_datos_hostDime.result.length > 0 ? arr_datos_hostDime.result[0].name + '\n' + arr_datos_hostDime.result[0].interfaces[0].ip : '';
      this.arrHostDime[0]['problemas_isp'] = problemas_isp_hostdime;
      this.arrHostDime[0]['problemas_enlace'] = problemas_hostdime;
      this.arrHostDime[0]['problemas_enlace_tlaquepaque'] = problemas_hostdime_tlaquepaque;
      this.arrHostDime[0]['problemas_enlace_qro'] = problemas_hostdime_qro;
      this.arrHostDime[0]['interfaces_problema_isp'] = txtInterfacesHostDime_down;
      this.arrHostDime[0]['interfaces_problema'] = txtEnlacesHostDime_down;
      this.arrHostDime[0]['color_problemas_hostdime_qro'] = problemas_hostdime_qro ? totalProblemas_hostdime_qro == enlace_hostdime_qro.length ? '#ff0000' : '#fff200' : '';

      hdq++;
      j++;
      if (enlace_hostdime_qro.length == j) {
        this.buenosAires(isp, device);
      }

    });

  }

  async buenosAires(isp: any, device: any) {
    /*****************************************************************************/
    /*****************************************************************************/
    // Buenos aires
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_buenosAires = await this.zabbixService.getItem(14107, 'BUENOSAIRES');
    console.log(interfaces_buenosAires.result);

    let txtInterfacesBA = '<table class="table table-striped">';
    let txtInterfacesBA_down = '';
    let txtInterfaces_ba_kiomty = '<table class="table table-striped">';
    let txtInterfaces_ba_qro = '<table class="table table-striped">';
    let txtEnlacesBA_down = '';
    let txtInterfacesBA_isp = '<table class="table table-striped">';

    // Datos Buenos aires

    let arr_datos_buenosAires = await this.zabbixService.getHost(14107);
    console.log(arr_datos_buenosAires);

    // ISP´s
    const isp_ba = await isp.filter(x => x.device_name == "POP_BUEAIR-NVL4038-NE-X8A-CA");
    console.log("ISP´s BuenosAires:", isp_ba);

    let ancho_banda_isp_ba = isp_ba.length >= 10 ? isp_ba.length / 10 : isp_ba.length * 100;
    let umedida_isp_ba = isp_ba.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_isp_ba = false;
    let totalProblemas_isp_ba
    let iba = 0;
    await isp_ba.forEach(async element => {
      // txtInterfacesBA_isp = txtInterfacesBA_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      if (iba == 0) {
        txtInterfacesBA_isp = txtInterfacesBA_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_buenosAires.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      iba++;

      const resp = await this.zabbixService.getItemInterface(14107, element.interface_description ? element.interface_description : element.interface_name.split('_')[2]);

      console.log('Resp Buenos Aires:', resp);

      const problems = await this.zabbixService.getProblems(14107, element.interface_description ? element.interface_description : element.interface_name.split('_')[2]);


      // txtInterfaces_isp = txtInterfaces_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      if (resp.result.length == 0 || problems.result.length > 0) {
        problemas_isp_ba = true;
        totalProblemas_isp_ba++;
        let txt = element.interface_description ? element.interface_description : element.interface_name.split('_')[2]
        txtInterfacesBA_isp = txtInterfacesBA_isp + '<tr><td class="text-danger">' + txt + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
      } else {
        txtInterfacesBA_isp = txtInterfacesBA_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

    });

    // Enlaces Arista-Buenos Aires
    //   const enlace_arista_BA = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP_BUEAIR-NVL4038-NE-X8A-CA") ||
    // (x.nombre_equipo_destino == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_origen == "POP_BUEAIR-NVL4038-NE-X8A-CA"));
    const enlace_arista_BA = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP_BUEAIR-NVL4038-NE-X8A-CA"));

    let ancho_banda_BA = enlace_arista_BA.length >= 10 ? enlace_arista_BA.length / 10 : enlace_arista_BA.length * 100;
    let umedida_BA = enlace_arista_BA.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_BA = enlace_arista_BA.length > 0 ? 0 : 2;
    let totalProblemas_arista_ba = 0;

    if (enlace_arista_BA.length > 0) {

      let aba = 0;
      enlace_arista_BA.forEach(async element => {
        // txtInterfacesBA =  txtInterfacesBA + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14107, element.descripcion_interface_origen);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14107, element.descripcion_interface_destino);
        console.log("Resp Interfaces Arista->BuenosAires: ", respO.result);
        console.log("Resp Interfaces BuenosAires->Arista: ", respD.result);
        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14107, element.descripcion_interface_origen);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14107, element.descripcion_interface_destino);

        console.log('Problemas enlaces enlace_arista_BA:', problems);

        if (aba == 0) {
          txtInterfacesBA = txtInterfacesBA + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_BA = 1;
          totalProblemas_arista_ba++;
          txtInterfacesBA = txtInterfacesBA + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        }
        else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_BA = 1;
          txtInterfacesBA = txtInterfacesBA + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfacesBA = txtInterfacesBA + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }


        this.arrBuenosAires[0]['interfaces'] = txtInterfacesBA + '</tbody></table>';
        this.arrBuenosAires[0]['interfaces_isp'] = txtInterfacesBA_isp;
        this.arrBuenosAires[0]['ancho_banda_total'] = ancho_banda_BA + umedida_BA;
        this.arrBuenosAires[0]['ancho_banda_total_isp'] = ancho_banda_isp_ba + umedida_isp_ba;
        this.arrBuenosAires[0]['host'] = arr_datos_buenosAires.result.length > 0 ? arr_datos_buenosAires.result[0].name + '\n' + arr_datos_buenosAires.result[0].interfaces[0].ip : '';
        this.arrBuenosAires[0]['problemas_isp'] = problemas_isp_ba;
        this.arrBuenosAires[0]['problemas_enlace'] = problemas_BA;
        this.arrBuenosAires[0]['interfaces_problema_isp'] = txtInterfacesBA_down;
        this.arrBuenosAires[0]['interfaces_problema'] = txtEnlacesBA_down;
        this.arrBuenosAires[0]['color_problemas_isp_ba'] = problemas_isp_ba ? totalProblemas_isp_ba == isp_ba.length ? '#ff0000' : '#fff200' : '';
        this.arrBuenosAires[0]['color_problemas_ba_arista'] = problemas_BA ? totalProblemas_arista_ba == enlace_arista_BA.length ? '#ff0000' : '#fff200' : '';
        aba++;
      });
    } else {
      this.arrBuenosAires[0]['ancho_banda_total'] = '';
      this.arrBuenosAires[0]['problemas_enlace'] = 2;
    }

    const enlace_BA_KioMty = await device.filter(x => (x.nombre_equipo_origen == "POP_BUEAIR-NVL4038-NE-X8A-CA" && x.nombre_equipo_destino == "POP_KIO-MTY-NE40E-X8A-CA"));
    console.log("Enlace Buenos Aires -> Kio Mty:", enlace_BA_KioMty);

    let ancho_banda_ba_kiomty = enlace_BA_KioMty.length >= 10 ? enlace_BA_KioMty.length / 10 : enlace_BA_KioMty.length * 100;
    let umedida_ba_kiomty = enlace_BA_KioMty.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_ba_kiomty = false;
    let totalProblemas_ba_kiomty = 0;

    let bak = 0;
    enlace_BA_KioMty.forEach(async element => {
      console.log("Enlaces Buenos Aires->Kio MTY: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14106, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14106, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);
      console.log("Resp Interfaces Buenos Aires->Kio MTY: ", respO.result);
      console.log("Resp Interfaces Kio MTY->Buenos Aires: ", respD.result);

      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14106, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14106, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);

      console.log('Problemas enlaces enlace_BA_KioMty:', problems);
      if (bak == 0) {
        txtInterfaces_ba_kiomty = txtInterfaces_ba_kiomty + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_ba_kiomty = true;
        totalProblemas_ba_kiomty++;
        txtInterfaces_ba_kiomty = txtInterfaces_ba_kiomty + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_ba_kiomty = true;
        txtInterfaces_ba_kiomty = txtInterfaces_ba_kiomty + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_ba_kiomty = txtInterfaces_ba_kiomty + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }

      // const problems = await this.zabbixService.getProblems(14102, element.descripcion_interface_origen);
      // console.log('Problemas enlaces enlace_BA_KioMty:', problems);
      // if (problems.result.length > 0) {
      //   problemas_ba_kiomty = true;
      //   // txtEnlacesHostDime_down = txtEnlacesHostDime_down + '<br>' + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      //   txtInterfaces_ba_kiomty = txtInterfaces_ba_kiomty + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }
      this.arrBuenosAires[0]['interfaces'] = txtInterfacesBA + '</tbody></table>';
      this.arrBuenosAires[0]['interfaces_isp'] = txtInterfacesBA_isp + '</tbody></table>';
      this.arrBuenosAires[0]['interfaces_ba_kiomty'] = txtInterfaces_ba_kiomty + '</tbody></table>';
      this.arrBuenosAires[0]['ancho_banda_total'] = ancho_banda_BA + umedida_BA;
      this.arrBuenosAires[0]['ancho_banda_total_isp'] = ancho_banda_isp_ba + umedida_isp_ba;
      this.arrBuenosAires[0]['ancho_banda_total_ba_kiomty'] = ancho_banda_ba_kiomty + umedida_ba_kiomty;
      this.arrBuenosAires[0]['host'] = arr_datos_buenosAires.result.length > 0 ? arr_datos_buenosAires.result[0].name + '\n' + arr_datos_buenosAires.result[0].interfaces[0].ip : '';
      this.arrBuenosAires[0]['problemas_isp'] = problemas_isp_ba;
      this.arrBuenosAires[0]['problemas_enlace'] = problemas_BA;
      this.arrBuenosAires[0]['problemas_enlace_kiomty'] = problemas_ba_kiomty;
      this.arrBuenosAires[0]['interfaces_problema_isp'] = txtInterfacesBA_down;
      this.arrBuenosAires[0]['interfaces_problema'] = txtEnlacesBA_down;
      this.arrBuenosAires[0]['color_problemas_ba_kiomty'] = problemas_ba_kiomty ? totalProblemas_ba_kiomty == enlace_BA_KioMty.length ? '#ff0000' : '#fff200' : '';
      bak++;
    });

    // Enlace Buenos aires -> Kio Qro

    const enlace_ba_qro = await device.filter(x => (x.nombre_equipo_origen == "POP_BUEAIR-NVL4038-NE-X8A-CA" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));
    console.log("Enlace Buenos Aires -> Kio QRO:", enlace_ba_qro);

    let ancho_banda_ba_qro = enlace_ba_qro.length >= 10 ? enlace_ba_qro.length / 10 : enlace_ba_qro.length * 100;
    let umedida_ba_qro = enlace_ba_qro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_ba_qro = enlace_ba_qro.length > 0 ? 0 : 2;
    let totalProblemas_ba_qro = 0;

    let j = 0;
    let baq = 0;
    if (enlace_ba_qro.length > 0) {
      enlace_ba_qro.forEach(async element => {
        console.log("Enlaces Buenos Aires->Kio QRO: ", element);

        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);
        console.log("Resp Interfaces Buenos Aires->Kio QRO: ", respO.result);
        console.log("Resp Interfaces Kio QRO->Buenos Aires: ", respD.result);

        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP_BUEAIR-NVL4038-NE-X8A-CA' ? 14107 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);

        console.log('Problemas enlaces enlace_ba_qro:', problems);

        if (baq == 0) {
          txtInterfaces_ba_qro = txtInterfaces_ba_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_ba_qro = 1;
          totalProblemas_ba_qro++;
          txtInterfaces_ba_qro = txtInterfaces_ba_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        }
        else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_ba_qro = 1;
          txtInterfaces_ba_qro = txtInterfaces_ba_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfaces_ba_qro = txtInterfaces_ba_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }

        // const problems = await this.zabbixService.getProblems(14104, element.descripcion_interface_origen);
        // console.log('Problemas enlaces enlace_ba_qro:', problems);
        // if (problems.result.length > 0) {
        //   problemas_ba_qro = 1;
        //   // txtEnlacesHostDime_down = txtEnlacesHostDime_down + '<br>' + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
        //   txtInterfaces_ba_qro = txtInterfaces_ba_qro + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
        // }
        this.arrBuenosAires[0]['interfaces'] = txtInterfacesBA + '</tbody></table>';
        this.arrBuenosAires[0]['interfaces_isp'] = txtInterfacesBA_isp + '';
        this.arrBuenosAires[0]['interfaces_ba_qro'] = txtInterfaces_ba_qro + '</tbody></table>';
        this.arrBuenosAires[0]['interfaces_ba_kiomty'] = txtInterfaces_ba_kiomty + '</tbody></table>';
        this.arrBuenosAires[0]['ancho_banda_total'] = ancho_banda_BA + umedida_BA;
        this.arrBuenosAires[0]['ancho_banda_total_isp'] = ancho_banda_isp_ba + umedida_isp_ba;
        this.arrBuenosAires[0]['ancho_banda_total_ba_kiomty'] = ancho_banda_ba_kiomty + umedida_ba_kiomty;
        this.arrBuenosAires[0]['ancho_banda_total_ba_qro'] = ancho_banda_ba_qro + umedida_ba_qro;
        this.arrBuenosAires[0]['host'] = arr_datos_buenosAires.result.length > 0 ? arr_datos_buenosAires.result[0].name + '\n' + arr_datos_buenosAires.result[0].interfaces[0].ip : '';
        this.arrBuenosAires[0]['problemas_isp'] = problemas_isp_ba;
        this.arrBuenosAires[0]['problemas_enlace'] = problemas_BA;
        this.arrBuenosAires[0]['problemas_enlace_qro'] = problemas_ba_qro;
        this.arrBuenosAires[0]['problemas_enlace_kiomty'] = problemas_ba_kiomty;
        this.arrBuenosAires[0]['interfaces_problema_isp'] = txtInterfacesBA_down;
        this.arrBuenosAires[0]['interfaces_problema'] = txtEnlacesBA_down;
        this.arrBuenosAires[0]['color_problemas_ba_qro'] = problemas_ba_qro ? totalProblemas_ba_qro == enlace_ba_qro.length ? '#ff0000' : '#fff200' : '';

        j++;
        baq++;
        if (enlace_ba_qro.length == j) {
          this.tlaquepaque(isp, device);
        }

      });
    } else {
      this.arrBuenosAires[0]['problemas_enlace_qro'] = problemas_ba_qro;
      this.arrBuenosAires[0]['interfaces_ba_qro'] = txtInterfaces_ba_qro;
      this.arrBuenosAires[0]['ancho_banda_total_ba_qro'] = '';
      this.tlaquepaque(isp, device);
    }

  }

  async tlaquepaque(isp: any, device: any) {
    /*****************************************************************************/
    /*****************************************************************************/
    // Tlaquepaque
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_tlaquepaque = await this.zabbixService.getItem(14102, 'TLAQUEPAQUE');
    console.log(interfaces_tlaquepaque.result);

    let txtInterfacesTlaquepaque = '<table class="table table-striped">';
    let txtInterfacesTlaquepaque_isp = '<table class="table table-striped">';
    let txtInterfacesTlaquepaque_down = '';
    let txtInterfaces_tlquepaque_qro = '<table class="table table-striped">';
    let txtInterfaces_tlquepaque_arista = '<table class="table table-striped">';

    interfaces_tlaquepaque.result.forEach(element => {
      txtInterfacesTlaquepaque = txtInterfacesTlaquepaque + element.name.split(':')[0].split('(')[0] + '\n';
    });

    let ancho_banda_Tlaquepaque = interfaces_tlaquepaque.result.length * 100;
    let umedida_Tlaquepaque = interfaces_tlaquepaque.result.length >= 10 ? 'Tbps' : 'Gbps';

    // Datos Tlaquepaque

    let arr_datos_Tlaquepaque = await this.zabbixService.getHost(14102);
    console.log(arr_datos_Tlaquepaque);

    // ISP´s
    const isp_tlaquepaque = await isp.filter(x => x.device_name == "POP_TLAQUE-JAL86450-X16A-CA");

    console.log("ISP´s Tlaquepaque:", isp_tlaquepaque);
    let ancho_banda_isp_tlaquepaque = isp_tlaquepaque.length >= 10 ? isp_tlaquepaque.length / 10 : isp_tlaquepaque.length * 100;
    let umedida_isp_tlaquepaque = isp_tlaquepaque.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_isp_tlaquepaque = false;
    let totalProblemas_isp_tlaquepaque = 0;

    let it = 0;
    isp_tlaquepaque.forEach(async element => {
      // txtInterfacesTlaquepaque_isp = txtInterfacesTlaquepaque_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      const resp = await this.zabbixService.getItemInterface(14102, element.interface_description);
      console.log('Interface Tlaquepaque: ', element);
      console.log('Resp Tlaquepaque:', resp);

      const problems = await this.zabbixService.getProblems(14102, element.interface_description);
      console.log('Problems Tlaquepaque:', problems);

      if (it == 0) {
        txtInterfacesTlaquepaque_isp = txtInterfacesTlaquepaque_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_Tlaquepaque.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      it++;

      if (resp.result.length == 0 || problems.result.length > 0) {
        problemas_isp_tlaquepaque = true;
        totalProblemas_isp_tlaquepaque++;
        txtInterfacesTlaquepaque_isp = txtInterfacesTlaquepaque_isp + '<tr><td class="text-danger">' + element.interface_description + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
      } else {
        txtInterfacesTlaquepaque_isp = txtInterfacesTlaquepaque_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }


      this.arrTlaquepaque[0]['interfaces'] = txtInterfacesTlaquepaque + '</tbody></table>';
      this.arrTlaquepaque[0]['interfaces_isp'] = txtInterfacesTlaquepaque_isp + '</tbody></table>';
      this.arrTlaquepaque[0]['ancho_banda_total'] = ancho_banda_Tlaquepaque + umedida_Tlaquepaque;
      this.arrTlaquepaque[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlaquepaque + umedida_isp_tlaquepaque;
      this.arrTlaquepaque[0]['host'] = arr_datos_Tlaquepaque.result.length > 0 ? arr_datos_Tlaquepaque.result[0].name + '\n' + arr_datos_Tlaquepaque.result[0].interfaces[0].ip : '';
      this.arrTlaquepaque[0]['problemas_isp'] = problemas_isp_tlaquepaque;
      this.arrTlaquepaque[0]['interfaces_problema_isp'] = txtInterfacesTlaquepaque_down;
      this.arrTlaquepaque[0]['color_problemas_isp'] = problemas_isp_tlaquepaque ? totalProblemas_isp_tlaquepaque == isp_tlaquepaque.length ? '#ff0000' : '#fff200' : '';
    });

    // Enlaces Tlaquepaque Kio QRO

    const enlace_tlaquepaque_qro = await device.filter(x => (x.nombre_equipo_origen == "POP_TLAQUE-JAL86450-X16A-CA" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));

    console.log("Enlace Tlaquepaque -> Kio QRO:", enlace_tlaquepaque_qro);
    let ancho_banda_tlaquepaque_qro = enlace_tlaquepaque_qro.length >= 10 ? enlace_tlaquepaque_qro.length / 10 : enlace_tlaquepaque_qro.length * 100;
    let umedida_tlaquepaque_qro = enlace_tlaquepaque_qro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_tlaquepaque_qro = enlace_tlaquepaque_qro.length > 0 ? 0 : 2;
    let totalProblemas_tlaquepaque_qro = 0;

    let tq= 0;
    await enlace_tlaquepaque_qro.forEach(async element => {
      console.log("Enlaces Tlaquepaque->Kio QRO: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP_TLAQUE-JAL86450-X16A-CA' ? 14102 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP_TLAQUE-JAL86450-X16A-CA' ? 14102 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);
      console.log("Resp Interfaces Tlaquepaque->Kio QRO: ", respO.result);
      console.log("Resp Interfaces Kio QRO->Tlaquepaque: ", respD.result);

      // Problemas enlace_tlaquepaque_qro
      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP_TLAQUE-JAL86450-X16A-CA' ? 14102 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP_TLAQUE-JAL86450-X16A-CA' ? 14102 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);

      console.log('Problemas enlaces enlace_tlaquepaque_qro:', problems);

      if (tq == 0) {
        txtInterfaces_tlquepaque_qro = txtInterfaces_tlquepaque_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_tlaquepaque_qro = 1;
        totalProblemas_tlaquepaque_qro++;
        txtInterfaces_tlquepaque_qro = txtInterfaces_tlquepaque_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      }
      else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_tlaquepaque_qro = 1;
        txtInterfaces_tlquepaque_qro = txtInterfaces_tlquepaque_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_tlquepaque_qro = txtInterfaces_tlquepaque_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }

      // const problems = await this.zabbixService.getProblems(14104, element.descripcion_interface_origen);
      // console.log('Problemas enlaces enlace_tlaquepaque_qro:', problems);
      // if (problems.result.length > 0) {
      //   problemas_tlaquepaque_qro = 1;
      //   txtInterfaces_tlquepaque_qro = txtInterfaces_tlquepaque_qro + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b>Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }

      this.arrTlaquepaque[0]['interfaces'] = txtInterfacesTlaquepaque + '</tbody></table>';
      this.arrTlaquepaque[0]['interfaces_isp'] = txtInterfacesTlaquepaque_isp + '</tbody></table>';
      this.arrTlaquepaque[0]['ancho_banda_total'] = ancho_banda_Tlaquepaque + umedida_Tlaquepaque;
      this.arrTlaquepaque[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlaquepaque + umedida_isp_tlaquepaque;
      this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_qro'] = ancho_banda_tlaquepaque_qro + umedida_tlaquepaque_qro;
      this.arrTlaquepaque[0]['host'] = arr_datos_Tlaquepaque.result.length > 0 ? arr_datos_Tlaquepaque.result[0].name + '\n' + arr_datos_Tlaquepaque.result[0].interfaces[0].ip : '';
      this.arrTlaquepaque[0]['problemas_isp'] = problemas_isp_tlaquepaque;
      this.arrTlaquepaque[0]['interfaces_problema_isp'] = txtInterfacesTlaquepaque_down;
      this.arrTlaquepaque[0]['problemas_enlace_qro'] = problemas_tlaquepaque_qro;
      this.arrTlaquepaque[0]['interfaces_tlaquepaque_qro'] = txtInterfaces_tlquepaque_qro + '</tbody></table>';
      this.arrTlaquepaque[0]['color_problemas_tlaquepaque_qro'] = problemas_tlaquepaque_qro ? totalProblemas_tlaquepaque_qro == enlace_tlaquepaque_qro.length ? '#ff0000' : '#fff200' : '';

      tq++;
    });

    // Enlaces Tlaquepaque -> Equinix

    const enlace_tlaquepaque_arista = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP_TLAQUE-JAL86450-X16A-CA"));

    console.log("Enlace Tlaquepaque -> Arista :", enlace_tlaquepaque_arista);
    let ancho_banda_tlaquepaque_arista = enlace_tlaquepaque_arista.length >= 10 ? enlace_tlaquepaque_arista.length / 10 : enlace_tlaquepaque_arista.length * 100;
    let umedida_tlaquepaque_arista = enlace_tlaquepaque_arista.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_tlaquepaque_arista = enlace_tlaquepaque_arista.length > 0 ? 0 : 2;
    let totalProblemas_tlaquepaque_arista = 0;

    let j = 0;
    let ta = 0;
    if (enlace_tlaquepaque_arista.length > 0) {
      enlace_tlaquepaque_arista.forEach(async element => {
        console.log("Enlaces Tlaquepaque->Arista: ", element);

        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14102, element.descripcion_interface_origen);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14102, element.descripcion_interface_destino);
        console.log("Resp Interfaces Arista->Tlaquepaque: ", respO.result);
        console.log("Resp Interfaces Tlaquepaque->Arista: ", respD.result);

        // Problemas enlace_tlaquepaque_qro
        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14102, element.descripcion_interface_origen);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14102, element.descripcion_interface_destino);

        console.log('Problemas enlaces enlace_tlaquepaque_arista:', problems);

        if (ta == 0) {
          txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_tlaquepaque_arista = 1;
          totalProblemas_tlaquepaque_arista++;
          txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_tlaquepaque_arista = 1;
          txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }

        // if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        //   problemas_tlaquepaque_arista = 1;
        //   txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<b class="text-danger">Origen: ' + element.descripcion_interface_origen + ' Destino: ' + element.descripcion_interface_destino + '</b><br>';
        // }
        // else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        //   problemas_tlaquepaque_arista = 1;
        //   txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<b>Origen: </b>' + element.descripcion_interface_origen + '<b class="text-danger"> Destino: ' + element.descripcion_interface_destino + '</b><br>';
        // }
        // else {
        //   txtInterfaces_tlquepaque_arista = txtInterfaces_tlquepaque_arista + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b> Destino: </b>' + element.descripcion_interface_destino + '<br>';
        // }


        this.arrTlaquepaque[0]['interfaces'] = txtInterfacesTlaquepaque + '</tbody></table>';
        this.arrTlaquepaque[0]['interfaces_isp'] = txtInterfacesTlaquepaque_isp;
        this.arrTlaquepaque[0]['ancho_banda_total'] = ancho_banda_Tlaquepaque + umedida_Tlaquepaque;
        this.arrTlaquepaque[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlaquepaque + umedida_isp_tlaquepaque;
        this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_qro'] = ancho_banda_tlaquepaque_qro + umedida_tlaquepaque_qro;
        this.arrTlaquepaque[0]['host'] = arr_datos_Tlaquepaque.result.length > 0 ? arr_datos_Tlaquepaque.result[0].name + '\n' + arr_datos_Tlaquepaque.result[0].interfaces[0].ip : '';
        this.arrTlaquepaque[0]['problemas_isp'] = problemas_isp_tlaquepaque;
        this.arrTlaquepaque[0]['interfaces_problema_isp'] = txtInterfacesTlaquepaque_down;
        this.arrTlaquepaque[0]['problemas_enlace_qro'] = problemas_tlaquepaque_qro;
        this.arrTlaquepaque[0]['interfaces_tlaquepaque_qro'] = txtInterfaces_tlquepaque_qro + '</tbody></table>';
        this.arrTlaquepaque[0]['problemas_enlace_arista'] = problemas_tlaquepaque_arista;
        this.arrTlaquepaque[0]['interfaces_tlaquepaque_arista'] = txtInterfaces_tlquepaque_arista + '</tbody></table>';
        this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_arista'] = ancho_banda_tlaquepaque_arista + umedida_tlaquepaque_arista;
        this.arrTlaquepaque[0]['color_problemas_tlaquepaque_arista'] = problemas_tlaquepaque_arista ? totalProblemas_tlaquepaque_arista == enlace_tlaquepaque_arista.length ? '#ff0000' : '#fff200' : '';

        ta++;
        j++;
        if (enlace_tlaquepaque_arista.length == j) {
          this.kioMty(isp, device);
        }

      });
    } else {
      this.arrTlaquepaque[0]['problemas_enlace_qro'] = problemas_tlaquepaque_qro;
      this.arrTlaquepaque[0]['interfaces_tlaquepaque_qro'] = txtInterfaces_tlquepaque_qro;
      this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_qro'] = '';
      this.arrTlaquepaque[0]['problemas_enlace_arista'] = problemas_tlaquepaque_arista;
      this.arrTlaquepaque[0]['interfaces_tlaquepaque_arista'] = txtInterfaces_tlquepaque_arista;
      this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_arista'] = '';
      this.kioMty(isp, device);
    }

  }

  async kioMty(isp: any, device: any) {
    /*****************************************************************************/
    /*****************************************************************************/
    // Kio MTY
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_KioMty = await this.zabbixService.getItem(14106, 'KIOMTY');
    console.log(interfaces_KioMty.result);

    let txtInterfacesKioMty = '<table class="table table-striped">';
    let txtInterfacesKioMty_isp = '<table class="table table-striped">';
    let txtInterfacesMty_down = '';
    let txtInterfaces_mty_qro = '<table class="table table-striped">';
    let txtInterfaces_mty_arista = '<table class="table table-striped">';

    interfaces_KioMty.result.forEach(element => {
      txtInterfacesKioMty = txtInterfacesKioMty + element.name.split(':')[0].split('(')[0] + '\n';
    });

    let ancho_banda_KioMty = interfaces_KioMty.result.length * 100;
    let umedida_KioMty = interfaces_KioMty.result.length >= 10 ? 'Tbps' : 'Gbps';

    // Datos KIO MTY

    let arr_datos_KioMty = await this.zabbixService.getHost(14106);
    console.log(arr_datos_KioMty);

    // ISP´s
    const isp_mty = await isp.filter(x => x.device_name == "POP_KIO-MTY-NE40E-X8A-CA");

    console.log("ISP´s Kio Mty:", isp_mty);
    let ancho_banda_isp_KioMty = isp_mty.length >= 10 ? isp_mty.length / 10 : isp_mty.length * 100;
    let umedida_isp_KioMty = isp_mty.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_isp_mty = false;
    let totalProblemas_isp_mty = 0;
    let im = 0;

    await isp_mty.forEach(async element => {
      // txtInterfacesKioMty_isp = txtInterfacesKioMty_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      const resp = await this.zabbixService.getItemInterface(14106, element.interface_description);
      console.log('Resp Kio Mty:', resp);

      const problems = await this.zabbixService.getProblems(14106, element.interface_description);
      console.log('Problems Kio MTY:', problems);

      if (im == 0) {
        txtInterfacesKioMty_isp = txtInterfacesKioMty_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_KioMty.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      im++;


      if (resp.result.length == 0 || problems.result.length > 0) {
        problemas_isp_mty = true;
        totalProblemas_isp_mty++;
        txtInterfacesKioMty_isp = txtInterfacesKioMty_isp + '<tr><td class="text-danger">' + element.interface_description + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
      } else {
        txtInterfacesKioMty_isp = txtInterfacesKioMty_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

      this.arrKioMty[0]['interfaces'] = txtInterfacesKioMty + '</tbody></table>';
      this.arrKioMty[0]['interfaces_isp'] = txtInterfacesKioMty_isp + '</tbody></table>';
      this.arrKioMty[0]['ancho_banda_total'] = ancho_banda_KioMty + umedida_KioMty;
      this.arrKioMty[0]['ancho_banda_total_isp'] = ancho_banda_isp_KioMty + umedida_isp_KioMty;
      this.arrKioMty[0]['host'] = arr_datos_KioMty.result.length > 0 ? arr_datos_KioMty.result[0].name + '\n' + arr_datos_KioMty.result[0].interfaces[0].ip : '';
      this.arrKioMty[0]['problemas_isp'] = problemas_isp_mty;
      this.arrKioMty[0]['interfaces_problema_isp'] = txtInterfacesMty_down;
      this.arrKioMty[0]['color_problemas_isp'] = problemas_isp_mty ? totalProblemas_isp_mty == isp_mty.length ? '#ff0000' : '#fff200' : '';


    });

    // Enlaces Kio MTY ->  Kio QRO

    const enlace_mty_qro = await device.filter(x => (x.nombre_equipo_origen == "POP_KIO-MTY-NE40E-X8A-CA" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));

    console.log("Enlace Kio MTY -> Kio QRO:", enlace_mty_qro);
    let ancho_banda_mty_qro = enlace_mty_qro.length >= 10 ? enlace_mty_qro.length / 10 : enlace_mty_qro.length * 100;
    let umedida_mty_qro = enlace_mty_qro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_mty_qro = false;
    let totalProblemas_mty_qro = 0;

    let mq = 0;
    await enlace_mty_qro.forEach(async element => {
      console.log("Enlaces Kio MTY->Kio QRO: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP_KIO-MTY-NE40E-X8A-CA' ? 14106 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP_KIO-MTY-NE40E-X8A-CA' ? 14106 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);
      console.log("Resp Interfaces Kio MTY->Kio QRO: ", respO.result);
      console.log("Resp Interfaces Kio QRO->Kio MTY: ", respD.result);

      // Problemas enlace_mty_qro
      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP_KIO-MTY-NE40E-X8A-CA' ? 14106 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[2]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP_KIO-MTY-NE40E-X8A-CA' ? 14106 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[2]);

      console.log('Problemas enlaces enlace_mty_qro:', problems);

      if (mq == 0) {
        txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_mty_qro = true;
        totalProblemas_mty_qro++;
        txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_mty_qro = true;
        txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }

      // if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
      //   problemas_mty_qro = true;
      //   txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<b class="text-danger">Origen: ' + element.descripcion_interface_origen + ' Destino: ' + element.descripcion_interface_destino + '</b><br>';
      // }
      // else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
      //   problemas_mty_qro = true;
      //   txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<b>Origen: </b>' + element.descripcion_interface_origen + '<b class="text-danger"> Destino: ' + element.descripcion_interface_destino + '</b><br>';
      // }
      // else {
      //   txtInterfaces_mty_qro = txtInterfaces_mty_qro + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b> Destino: </b>' + element.descripcion_interface_destino + '<br>';
      // }


      this.arrKioMty[0]['interfaces'] = txtInterfacesKioMty + '</tbody></table>';
      this.arrKioMty[0]['interfaces_isp'] = txtInterfacesKioMty_isp;
      this.arrKioMty[0]['ancho_banda_total'] = ancho_banda_KioMty + umedida_KioMty;
      this.arrKioMty[0]['ancho_banda_total_isp'] = ancho_banda_isp_KioMty + umedida_isp_KioMty;
      this.arrKioMty[0]['host'] = arr_datos_KioMty.result.length > 0 ? arr_datos_KioMty.result[0].name + '\n' + arr_datos_KioMty.result[0].interfaces[0].ip : '';
      this.arrKioMty[0]['problemas_isp'] = problemas_isp_mty;
      this.arrKioMty[0]['interfaces_problema_isp'] = txtInterfacesMty_down;
      this.arrKioMty[0]['problemas_enlace_qro'] = problemas_mty_qro;
      this.arrKioMty[0]['ancho_banda_total_mty_qro'] = ancho_banda_mty_qro + umedida_mty_qro;
      this.arrKioMty[0]['interfaces_mty_qro'] = txtInterfaces_mty_qro + '</tbody></table>';
      this.arrKioMty[0]['color_problemas_mty_qro'] = problemas_mty_qro ? totalProblemas_mty_qro == enlace_mty_qro.length ? '#ff0000' : '#fff200' : '';

      mq++;
      // if (enlace_mty_qro.length == j) {
      //   this.tlalnepantla(isp, device);
      // }

    });

    // Enlaces Mty -> Equinix

    const enlace_mty_arista = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP_KIO-MTY-NE40E-X8A-CA"));

    console.log("Enlace Mty -> Arista :", enlace_mty_arista);
    let ancho_banda_mty_arista = enlace_mty_arista.length >= 10 ? enlace_mty_arista.length / 10 : enlace_mty_arista.length * 100;
    let umedida_mty_arista = enlace_mty_arista.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_mty_arista = false;
    let totalProblemas_mty_arista = 0;

    let j = 0;
    let ma = 0;
    if (enlace_mty_arista.length > 0) {
      enlace_mty_arista.forEach(async element => {
        console.log("Enlaces Mty->Arista: ", element);

        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14106, element.descripcion_interface_origen);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14106, element.descripcion_interface_destino);
        console.log("Resp Interfaces Arista->Mty: ", respO.result);
        console.log("Resp Interfaces Mty->Arista: ", respD.result);

        // Problemas enlace_mty_arista
        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14106, element.descripcion_interface_origen);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14106, element.descripcion_interface_destino);

        console.log('Problemas enlaces enlace_mty_arista:', problems);

        if (ma == 0) {
          txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_mty_arista = true;
          totalProblemas_mty_arista++;
          txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_mty_arista = true;
          txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }


        // if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        //   problemas_mty_arista = true;
        //   txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<b class="text-danger">Origen: ' + element.descripcion_interface_origen + ' Destino: ' + element.descripcion_interface_destino + '</b><br>';
        // }
        // else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        //   problemas_mty_arista = true;
        //   txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<b>Origen: </b>' + element.descripcion_interface_origen + '<b class="text-danger"> Destino: ' + element.descripcion_interface_destino + '</b><br>';
        // }
        // else {
        //   txtInterfaces_mty_arista = txtInterfaces_mty_arista + '<b>Origen: </b>' + element.descripcion_interface_origen + ' <b> Destino: </b>' + element.descripcion_interface_destino + '<br>';
        // }



        this.arrKioMty[0]['interfaces'] = txtInterfacesKioMty + '</tbody></table>';
        this.arrKioMty[0]['interfaces_isp'] = txtInterfacesKioMty_isp;
        this.arrKioMty[0]['ancho_banda_total'] = ancho_banda_KioMty + umedida_KioMty;
        this.arrKioMty[0]['ancho_banda_total_isp'] = ancho_banda_isp_KioMty + umedida_isp_KioMty;
        this.arrKioMty[0]['host'] = arr_datos_KioMty.result.length > 0 ? arr_datos_KioMty.result[0].name + '\n' + arr_datos_KioMty.result[0].interfaces[0].ip : '';
        this.arrKioMty[0]['problemas_isp'] = problemas_isp_mty;
        this.arrKioMty[0]['interfaces_problema_isp'] = txtInterfacesMty_down;
        this.arrKioMty[0]['problemas_enlace_qro'] = problemas_mty_qro;
        this.arrKioMty[0]['ancho_banda_total_mty_qro'] = ancho_banda_mty_qro + umedida_mty_qro;
        this.arrKioMty[0]['interfaces_mty_qro'] = txtInterfaces_mty_qro + '</tbody></table>';
        this.arrKioMty[0]['problemas_enlace_arista'] = problemas_mty_arista;
        this.arrKioMty[0]['interfaces_mty_arista'] = txtInterfaces_mty_arista + '</tbody></table>';
        this.arrKioMty[0]['ancho_banda_total_mty_arista'] = ancho_banda_mty_arista + umedida_mty_arista;
        this.arrKioMty[0]['color_problemas_mty_arista'] = problemas_mty_arista ? totalProblemas_mty_arista == enlace_mty_arista.length ? '#ff0000' : '#fff200' : '';

        ma++;
        j++;
        if (enlace_mty_arista.length == j) {
          this.tlalnepantla(isp, device);
        }

      });
    } else {
      this.arrKioMty[0]['problemas_enlace_arista'] = false;
      this.arrKioMty[0]['interfaces_mty_arista'] = '';
      this.arrKioMty[0]['ancho_banda_total_mty_arista'] = '';
      this.tlalnepantla(isp, device);
    }
  }

  async tlalnepantla(isp: any, device: any) {
    /*****************************************************************************/
    /*****************************************************************************/
    // Tlalnepantla
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_Tlalnepantla = await this.zabbixService.getItem(14103, 'TLALNEPANTLA');
    console.log(interfaces_Tlalnepantla.result);

    let txtInterfacesTlalnepantla = '<table class="table table-striped">';
    let txtInterfacesTlalnepantla_isp = '<table class="table table-striped">';
    let txtInterfacesTlalnepantla_down = '';
    let txtInterfaces_tlalnepantla_qro = '<table class="table table-striped">';
    let txtInterfaces_tlalnepantla_churubusco = '<table class="table table-striped">';
    let txtInterfaces_tlalnepantla_arista = '<table class="table table-striped">';

    interfaces_Tlalnepantla.result.forEach(element => {
      txtInterfacesTlalnepantla = txtInterfacesTlalnepantla + element.name.split(':')[0].split('(')[0] + '\n';
    });

    let ancho_banda_Tlalnepantla = interfaces_Tlalnepantla.result.length * 100;
    let umedida_Tlalnepantla = interfaces_Tlalnepantla.result.length >= 10 ? 'Tbps' : 'Gbps';

    // Datos Tlalnepantla

    let arr_datos_Tlalnepantla = await this.zabbixService.getHost(14103);
    console.log(arr_datos_Tlalnepantla);

    // ISP´s
    const isp_tlalnepantla = await isp.filter(x => x.device_name == "POP-TLALNE-NE-X16A");

    console.log("ISP´s Tlalnepantla:", isp_tlalnepantla);
    let ancho_banda_isp_tlalnepantla = isp_tlalnepantla.length >= 10 ? isp_tlalnepantla.length / 10 : isp_tlalnepantla.length * 100;
    let umedida_isp_tlalnepantla = isp_tlalnepantla.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_isp_tlalnepantla = false;
    let totalProblemas_isp_tlalnepantla = 0;

    let itl = 0;
    await isp_tlalnepantla.forEach(async element => {
      // txtInterfacesTlalnepantla_isp = txtInterfacesTlalnepantla_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      const resp = await this.zabbixService.getItemInterface(14103, element.interface_description);

      const problems = await this.zabbixService.getProblems(14103, element.interface_description);
      console.log('Problems Tlalnepantla:', problems);

      if (itl == 0) {
        txtInterfacesTlalnepantla_isp = txtInterfacesTlalnepantla_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_Tlalnepantla.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      itl++;
      // txtInterfaces_isp = txtInterfaces_isp + element.interface_description + ' - ' + element.provider_name + '\n';
      if (resp.result.length == 0 || problems.result.length > 0) {
        problemas_isp_tlalnepantla = true;
        totalProblemas_isp_tlalnepantla++;
        // let txt = element.interface_description ? element.interface_description : element.interface_name.split('_')[2]
        txtInterfacesTlalnepantla_isp = txtInterfacesTlalnepantla_isp + '<tr><td class="text-danger">' + element.interface_description + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
      } else {
        txtInterfacesTlalnepantla_isp = txtInterfacesTlalnepantla_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

      this.arrTlalnepantla[0]['interfaces'] = txtInterfacesTlalnepantla + '</tbody></table>';
      this.arrTlalnepantla[0]['interfaces_isp'] = txtInterfacesTlalnepantla_isp + '</tbody></table>';
      this.arrTlalnepantla[0]['ancho_banda_total'] = ancho_banda_Tlalnepantla + umedida_Tlalnepantla;
      this.arrTlalnepantla[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlalnepantla + umedida_isp_tlalnepantla;
      this.arrTlalnepantla[0]['host'] = arr_datos_Tlalnepantla.result.length > 0 ? arr_datos_Tlalnepantla.result[0].name + '\n' + arr_datos_Tlalnepantla.result[0].interfaces[0].ip : '';
      this.arrTlalnepantla[0]['problemas_isp'] = problemas_isp_tlalnepantla;
      this.arrTlalnepantla[0]['interfaces_problema_isp'] = txtInterfacesTlalnepantla_down;
      this.arrTlalnepantla[0]['color_problemas_isp'] = problemas_isp_tlalnepantla ? totalProblemas_isp_tlalnepantla == isp_tlalnepantla.length ? '#ff0000' : '#fff200' : '';


    });

    // Enlaces Tlalnepantla ->  Kio QRO

    const enlace_tlalnepantla_qro = await device.filter(x => (x.nombre_equipo_origen == "POP-TLALNE-NE-X16A" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));

    console.log("Enlace Tlalnepantla -> Kio QRO:", enlace_tlalnepantla_qro);
    let ancho_banda_tlalnepantla_qro = enlace_tlalnepantla_qro.length >= 10 ? enlace_tlalnepantla_qro.length / 10 : enlace_tlalnepantla_qro.length * 100;
    let umedida_tlalnepantla_qro = enlace_tlalnepantla_qro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_tlalnepantla_qro = false;
    let totalProblemas_tlalnepantla_qro = 0;

    let tq = 0;
    await enlace_tlalnepantla_qro.forEach(async element => {
      console.log("Enlaces Tlalnepantla->Kio QRO: ", element);

      const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP-TLALNE-NE-X16A' ? 14103 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP-TLALNE-NE-X16A' ? 14103 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);
      console.log("Resp Interfaces Tlalnepantla->Kio QRO: ", respO.result);
      console.log("Resp Interfaces Kio QRO->Tlalnepantla: ", respD.result);

      // Problemas enlace_tlalnepantla_qro
      const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP-TLALNE-NE-X16A' ? 14103 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
      const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP-TLALNE-NE-X16A' ? 14103 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);

      console.log('Problemas enlaces enlace_tlalnepantla_qro:', problems);

      if (tq == 0) {
        txtInterfaces_tlalnepantla_qro = txtInterfaces_tlalnepantla_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
      }

      if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
        problemas_tlalnepantla_qro = true;
        totalProblemas_tlalnepantla_qro++;
        txtInterfaces_tlalnepantla_qro = txtInterfaces_tlalnepantla_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
        problemas_tlalnepantla_qro = true;
        txtInterfaces_tlalnepantla_qro = txtInterfaces_tlalnepantla_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
      } else {
        txtInterfaces_tlalnepantla_qro = txtInterfaces_tlalnepantla_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
      }

      this.arrTlalnepantla[0]['interfaces'] = txtInterfacesTlalnepantla + '</tbody></table>';
      this.arrTlalnepantla[0]['interfaces_isp'] = txtInterfacesTlalnepantla_isp;
      this.arrTlalnepantla[0]['ancho_banda_total'] = ancho_banda_Tlalnepantla + umedida_Tlalnepantla;
      this.arrTlalnepantla[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlalnepantla + umedida_isp_tlalnepantla;
      this.arrTlalnepantla[0]['host'] = arr_datos_Tlalnepantla.result.length > 0 ? arr_datos_Tlalnepantla.result[0].name + '\n' + arr_datos_Tlalnepantla.result[0].interfaces[0].ip : '';
      this.arrTlalnepantla[0]['problemas_isp'] = problemas_isp_tlalnepantla;
      this.arrTlalnepantla[0]['interfaces_problema_isp'] = txtInterfacesTlalnepantla_down;
      this.arrTlalnepantla[0]['problemas_enlace_qro'] = problemas_tlalnepantla_qro;
      this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_qro'] = ancho_banda_tlalnepantla_qro + umedida_tlalnepantla_qro;
      this.arrTlalnepantla[0]['interfaces_tlalnepantla_qro'] = txtInterfaces_tlalnepantla_qro + '</tbody></table>';
      this.arrTlalnepantla[0]['color_problemas_tlalnepantla_qro'] = problemas_tlalnepantla_qro ? totalProblemas_tlalnepantla_qro == enlace_tlalnepantla_qro.length ? '#ff0000' : '#fff200' : '';

      tq++;
      // j++;
      // if (enlace_tlalnepantla_qro.length == j) {
      //   this.churubusco(isp, device);
      // }

    });

    // Enlaces Tlalnepantla ->  Churubusco

    const enlace_tlalnepantla_churubusco = await device.filter(x => (x.nombre_equipo_origen == "POP-TLALNE-NE-X16A" && x.nombre_equipo_destino == "POP-CHURUB-NE40-X8A"));

    console.log("Enlace Tlalnepantla -> Churubusco:", enlace_tlalnepantla_churubusco);
    let ancho_banda_tlalnepantla_churubusco = enlace_tlalnepantla_churubusco.length >= 10 ? enlace_tlalnepantla_churubusco.length / 10 : enlace_tlalnepantla_churubusco.length * 100;
    let umedida_tlalnepantla_churubusco = enlace_tlalnepantla_churubusco.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_tlalnepantla_churubusco = false;
    let totalProblemas_tlalnepantla_churubusco = 0;

    let tc = 0;
    if (enlace_tlalnepantla_churubusco.length > 0) {
      await enlace_tlalnepantla_churubusco.forEach(async element => {
        console.log("Enlaces Tlalnepantla -> Churubusco: ", element);

        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP-TLALNE-NE-X16A' ? 14103 : 14099, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP-TLALNE-NE-X16A' ? 14103 : 14099, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);
        console.log("Resp Interfaces Tlalnepantla->Churubusco: ", respO.result);
        console.log("Resp Interfaces Churubusco->Tlalnepantla: ", respD.result);

        // Problemas enlace_tlalnepantla_churubusco
        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP-TLALNE-NE-X16A' ? 14103 : 14099, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP-TLALNE-NE-X16A' ? 14103 : 14099, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);

        console.log('Problemas enlaces enlace_tlalnepantla_churubusco:', problems);

        if (tc == 0) {
          txtInterfaces_tlalnepantla_churubusco = txtInterfaces_tlalnepantla_churubusco + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_tlalnepantla_churubusco = true;
          totalProblemas_tlalnepantla_churubusco++;
          txtInterfaces_tlalnepantla_churubusco = txtInterfaces_tlalnepantla_churubusco + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_tlalnepantla_churubusco = true;
          txtInterfaces_tlalnepantla_churubusco = txtInterfaces_tlalnepantla_churubusco + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfaces_tlalnepantla_churubusco = txtInterfaces_tlalnepantla_churubusco + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }


        this.arrTlalnepantla[0]['interfaces'] = txtInterfacesTlalnepantla + '</tbody></table>';
        this.arrTlalnepantla[0]['interfaces_isp'] = txtInterfacesTlalnepantla_isp;
        this.arrTlalnepantla[0]['ancho_banda_total'] = ancho_banda_Tlalnepantla + umedida_Tlalnepantla;
        this.arrTlalnepantla[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlalnepantla + umedida_isp_tlalnepantla;
        this.arrTlalnepantla[0]['host'] = arr_datos_Tlalnepantla.result.length > 0 ? arr_datos_Tlalnepantla.result[0].name + '\n' + arr_datos_Tlalnepantla.result[0].interfaces[0].ip : '';
        this.arrTlalnepantla[0]['problemas_isp'] = problemas_isp_tlalnepantla;
        this.arrTlalnepantla[0]['interfaces_problema_isp'] = txtInterfacesTlalnepantla_down;
        this.arrTlalnepantla[0]['problemas_enlace_qro'] = problemas_tlalnepantla_qro;
        this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_qro'] = ancho_banda_tlalnepantla_qro + umedida_tlalnepantla_qro;
        this.arrTlalnepantla[0]['interfaces_tlalnepantla_qro'] = txtInterfaces_tlalnepantla_qro + '</tbody></table>';
        this.arrTlalnepantla[0]['problemas_enlace_churubusco'] = problemas_tlalnepantla_churubusco;
        this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_churubusco'] = ancho_banda_tlalnepantla_churubusco + umedida_tlalnepantla_churubusco;
        this.arrTlalnepantla[0]['interfaces_tlalnepantla_churubusco'] = txtInterfaces_tlalnepantla_churubusco + '</tbody></table>';
        this.arrTlalnepantla[0]['color_problemas_tlalnepantla_churubusco'] = problemas_tlalnepantla_churubusco ? totalProblemas_tlalnepantla_churubusco == enlace_tlalnepantla_churubusco.length ? '#ff0000' : '#fff200' : '';

        tc++;
      });
    } else {
      this.arrTlalnepantla[0]['problemas_enlace_qro'] = problemas_tlalnepantla_qro;
      this.arrTlalnepantla[0]['interfaces_tlalnepantla_qro'] = txtInterfaces_tlalnepantla_qro;
      this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_qro'] = '';
      this.arrTlalnepantla[0]['problemas_enlace_churubusco'] = problemas_tlalnepantla_churubusco;
      this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_churubusco'] = '';
      this.arrTlalnepantla[0]['interfaces_tlalnepantla_churubusco'] = txtInterfaces_tlalnepantla_churubusco;
    }

    // Enlaces Tlalnepantla -> Arista

    const enlace_tlalnepantla_arista = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP-TLALNE-NE-X16A"));

    console.log("Enlace Tlalnepantla -> Arista :", enlace_tlalnepantla_arista);
    let ancho_banda_tlalnepantla_arista = enlace_tlalnepantla_arista.length >= 10 ? enlace_tlalnepantla_arista.length / 10 : enlace_tlalnepantla_arista.length * 100;
    let umedida_tlalnepantla_arista = enlace_tlalnepantla_arista.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_tlalnepantla_arista = false;
    let totalProblemas_tlalnepantla_arista = 0;

    let j = 0;
    let tla = 0;
    if (enlace_tlalnepantla_arista.length > 0) {
      enlace_tlalnepantla_arista.forEach(async element => {
        console.log("Enlaces Tlalnepantla->Arista: ", element);

        const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14103, element.descripcion_interface_origen);
        const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14103, element.descripcion_interface_destino);
        console.log("Resp Interfaces Arista->Tlalnepantla: ", respO.result);
        console.log("Resp Interfaces Tlalnepantla->Arista: ", respD.result);

        // Problemas enlace_tlalnepantla_arista
        const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14103, element.descripcion_interface_origen);
        const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14103, element.descripcion_interface_destino);

        console.log('Problemas enlaces enlace_tlalnepantla_arista:', problems);

        if (tla == 0) {
          txtInterfaces_tlalnepantla_arista = txtInterfaces_tlalnepantla_arista + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
        }

        if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
          problemas_tlalnepantla_arista = true;
          totalProblemas_tlalnepantla_arista++;
          txtInterfaces_tlalnepantla_arista = txtInterfaces_tlalnepantla_arista + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
          problemas_tlalnepantla_arista = true;
          txtInterfaces_tlalnepantla_arista = txtInterfaces_tlalnepantla_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
        } else {
          txtInterfaces_tlalnepantla_arista = txtInterfaces_tlalnepantla_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
        }

        this.arrTlalnepantla[0]['interfaces'] = txtInterfacesTlalnepantla + '</tbody></table>';
        this.arrTlalnepantla[0]['interfaces_isp'] = txtInterfacesTlalnepantla_isp;
        this.arrTlalnepantla[0]['ancho_banda_total'] = ancho_banda_Tlalnepantla + umedida_Tlalnepantla;
        this.arrTlalnepantla[0]['ancho_banda_total_isp'] = ancho_banda_isp_tlalnepantla + umedida_isp_tlalnepantla;
        this.arrTlalnepantla[0]['host'] = arr_datos_Tlalnepantla.result.length > 0 ? arr_datos_Tlalnepantla.result[0].name + '\n' + arr_datos_Tlalnepantla.result[0].interfaces[0].ip : '';
        this.arrTlalnepantla[0]['problemas_isp'] = problemas_isp_tlalnepantla;
        this.arrTlalnepantla[0]['interfaces_problema_isp'] = txtInterfacesTlalnepantla_down;
        this.arrTlalnepantla[0]['problemas_enlace_qro'] = problemas_tlalnepantla_qro;
        this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_qro'] = ancho_banda_tlalnepantla_qro + umedida_tlalnepantla_qro;
        this.arrTlalnepantla[0]['interfaces_tlalnepantla_qro'] = txtInterfaces_tlalnepantla_qro + '</tbody></table>';
        this.arrTlalnepantla[0]['problemas_enlace_churubusco'] = problemas_tlalnepantla_churubusco;
        this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_churubusco'] = ancho_banda_tlalnepantla_churubusco + umedida_tlalnepantla_churubusco;
        this.arrTlalnepantla[0]['interfaces_tlalnepantla_churubusco'] = txtInterfaces_tlalnepantla_churubusco + '</tbody></table>';
        this.arrTlalnepantla[0]['problemas_enlace_arista'] = problemas_tlalnepantla_arista;
        this.arrTlalnepantla[0]['interfaces_tlalnepantla_arista'] = txtInterfaces_tlalnepantla_arista + '</tbody></table>';
        this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_arista'] = ancho_banda_tlalnepantla_arista + umedida_tlalnepantla_arista;
        this.arrTlalnepantla[0]['color_problemas_tlalnepantla_arista'] = problemas_tlalnepantla_arista ? totalProblemas_tlalnepantla_arista == enlace_tlalnepantla_arista.length ? '#ff0000' : '#fff200' : '';

        tla++;
        j++;
        if (enlace_tlalnepantla_arista.length == j) {
          this.churubusco(isp, device);
        }

      });
    } else {
      this.arrTlalnepantla[0]['problemas_enlace_arista'] = false;
      this.arrTlalnepantla[0]['interfaces_tlalnepantla_arista'] = '';
      this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_arista'] = '';
      this.churubusco(isp, device);
    }

  }

  async churubusco(isp: any, device: any) {
    /*****************************************************************************/
    /*****************************************************************************/
    // Churubusco
    /*****************************************************************************/
    /*****************************************************************************/

    let interfaces_Churubusco = await this.zabbixService.getItem(14099, 'CHURUBUSCO');
    console.log(interfaces_Churubusco.result);

    let txtInterfacesChurubusco = '<table class="table table-striped">';
    let txtInterfacesChurubusco_isp = '<table class="table table-striped">';
    let txtInterfacesChurubusco_down = '';
    let txtInterfaces_churubusco_qro = '<table class="table table-striped">';
    let txtInterfaces_churubusco_arista = '<table class="table table-striped">';

    interfaces_Churubusco.result.forEach(element => {
      txtInterfacesChurubusco = txtInterfacesChurubusco + element.name.split(':')[0].split('(')[0] + '\n';
    });

    let ancho_banda_Churubusco = interfaces_Churubusco.result.length * 100;
    let umedida_Churubusco = interfaces_Churubusco.result.length >= 10 ? 'Tbps' : 'Gbps';

    // Datos Churubusco

    let problemas_isp_churubusco = false;
    let arr_datos_Churubusco = await this.zabbixService.getHost(14099);
    console.log(arr_datos_Churubusco);

    // ISP´s
    const isp_churubusco = await isp.filter(x => x.device_name == "POP-CHURUB-NE40-X8A");
    console.log("ISP´s Churubusco:", isp_churubusco);
    let ancho_banda_isp_Churubusco = isp_churubusco.length >= 10 ? isp_churubusco.length / 10 : isp_churubusco.length * 100;
    let umedida_isp_Churubusco = isp_churubusco.length >= 10 ? 'Tbps' : 'Gbps';
    let totalProblemas_isp_churubusco = 0;
    let i = 0;
    let ic = 0;
    isp_churubusco.forEach(async element => {
      const resp = await this.zabbixService.getItemInterface(14099, element.interface_description);
      // console.log('Interface Churubusco: ', element);
      console.log('Resp Churubusco:', resp);

      if (ic == 0) {
        txtInterfacesChurubusco_isp = txtInterfacesChurubusco_isp + '<thead><tr><th class="text-center" colspan="2"><b>Origen</b></th></tr><tr><th class="text-center" colspan="2"><b> ' + arr_datos_Churubusco.result[0].name + ' </b></th></tr><tr><th class="text-center"><b>Interface</b></th><th class="text-center">Proveedor</th></tr></thead><tbody>';
      }
      ic++;

      const problems = await this.zabbixService.getProblems(14099, element.interface_description ? element.interface_description : element.interface_name.split('_')[1]);
      console.log('Problems Churubusco:', problems);

      if (!problems.error) {
        if (resp.result.length == 0 || problems.result.length > 0) {
          problemas_isp_churubusco = true;
          totalProblemas_isp_churubusco++;

          // let txt = element.interface_description ? element.interface_description : element.interface_name.split('_')[2]
          txtInterfacesChurubusco_isp = txtInterfacesChurubusco_isp + '<tr><td class="text-danger">' + element.interface_description + '</td><td class="text-danger">' + element.provider_name + '</td></tr>';
        } else {
          txtInterfacesChurubusco_isp = txtInterfacesChurubusco_isp + '<tr><td class="text-white">' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
        }
      }

      this.arrChurubusco[0]['interfaces'] = txtInterfacesChurubusco + '</tbody></table>';
      this.arrChurubusco[0]['interfaces_isp'] = txtInterfacesChurubusco_isp  + '</tbody></table>';
      this.arrChurubusco[0]['ancho_banda_total'] = ancho_banda_Churubusco + umedida_Churubusco;
      this.arrChurubusco[0]['ancho_banda_total_isp'] = ancho_banda_isp_Churubusco + umedida_isp_Churubusco;
      this.arrChurubusco[0]['host'] = arr_datos_Churubusco.result.length > 0 ? arr_datos_Churubusco.result[0].name + '\n' + arr_datos_Churubusco.result[0].interfaces[0].ip : '';
      this.arrChurubusco[0]['problemas_isp'] = problemas_isp_churubusco;
      this.arrChurubusco[0]['interfaces_problema_isp'] = txtInterfacesChurubusco_down;
      this.arrChurubusco[0]['color_problemas_isp'] = problemas_isp_churubusco ? totalProblemas_isp_churubusco == isp_churubusco.length ? '#ff0000' : '#fff200' : '';


      i++;
      if (isp_churubusco.length == i) {
        // Enlaces Churubusco ->  Kio QRO

        const enlace_churubusco_qro = await device.filter(x => (x.nombre_equipo_origen == "POP-CHURUB-NE40-X8A" && x.nombre_equipo_destino == "KIO-QRO-NE-X8-CA"));

        console.log("Enlace Churubusco -> Kio QRO:", enlace_churubusco_qro);
        let ancho_banda_churubusco_qro = enlace_churubusco_qro.length >= 10 ? enlace_churubusco_qro.length / 10 : enlace_churubusco_qro.length * 100;
        let umedida_churubusco_qro = enlace_churubusco_qro.length >= 10 ? 'Tbps' : 'Gbps';
        let problemas_churubusco_qro = false;
        let totalProblemas_churubusco_qro = 0;
        let j = 0;
        let cq = 0;
        if (enlace_churubusco_qro.length > 0) {
          enlace_churubusco_qro.forEach(async element => {
            console.log("Enlaces Churubusco->Kio QRO: ", element);

            const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'POP-CHURUB-NE40-X8A' ? 14099 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
            const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'POP-CHURUB-NE40-X8A' ? 14099 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);
            console.log("Resp Interfaces Churubusco->Kio QRO: ", respO.result);
            console.log("Resp Interfaces Kio QRO->Churubusco: ", respD.result);

            // Problemas enlace_churubusco_qro
            const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'POP-CHURUB-NE40-X8A' ? 14099 : 14104, element.descripcion_interface_origen ? element.descripcion_interface_origen : element.nombre_interface_origen.split('_')[1]);
            const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'POP-CHURUB-NE40-X8A' ? 14099 : 14104, element.descripcion_interface_destino ? element.descripcion_interface_destino : element.nombre_interface_destino.split('_')[1]);

            console.log('Problemas enlaces enlace_churubusco_qro:', problems);

            if (cq == 0) {
              txtInterfaces_churubusco_qro = txtInterfaces_churubusco_qro + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
            }

            if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
              problemas_churubusco_qro = true;
              totalProblemas_churubusco_qro++;
              txtInterfaces_churubusco_qro = txtInterfaces_churubusco_qro + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
            } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
              problemas_churubusco_qro = true;
              txtInterfaces_churubusco_qro = txtInterfaces_churubusco_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
            } else {
              txtInterfaces_churubusco_qro = txtInterfaces_churubusco_qro + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
            }

            this.arrChurubusco[0]['problemas_enlace_qro'] = problemas_churubusco_qro;
            this.arrChurubusco[0]['ancho_banda_total_churubusco_churubusco'] = ancho_banda_churubusco_qro + umedida_churubusco_qro;
            this.arrChurubusco[0]['interfaces_churubusco_qro'] = txtInterfaces_churubusco_qro;
            this.arrChurubusco[0]['color_problemas_churubusco_qro'] = problemas_churubusco_qro ? totalProblemas_churubusco_qro == enlace_churubusco_qro.length ? '#ff0000' : '#fff200' : '';

            j++;
            cq++;
            if (enlace_churubusco_qro.length == j) {

              // Enlaces Churubusco -> Equinix

              const enlace_churubusco_arista = await device.filter(x => (x.nombre_equipo_origen == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE" && x.nombre_equipo_destino == "POP-CHURUB-NE40-X8A"));

              console.log("Enlace Churubusco -> Arista :", enlace_churubusco_arista);
              let ancho_banda_churubusco_arista = enlace_churubusco_arista.length >= 10 ? enlace_churubusco_arista.length / 10 : enlace_churubusco_arista.length * 100;
              let umedida_churubusco_arista = enlace_churubusco_arista.length >= 10 ? 'Tbps' : 'Gbps';
              let problemas_churubusco_arista = false;
              let totalProblemas_churubusco_arista = 0;

              let k = 0;
              let ca = 0;
              if (enlace_churubusco_arista.length > 0) {
                enlace_churubusco_arista.forEach(async element => {
                  console.log("Enlaces Churubusco->Arista: ", element);

                  const respO = await this.zabbixService.getItemInterface(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14099, element.descripcion_interface_origen);
                  const respD = await this.zabbixService.getItemInterface(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14099, element.descripcion_interface_destino);
                  console.log("Resp Interfaces Arista->Churubusco: ", respO.result);
                  console.log("Resp Interfaces Churubusco->Arista: ", respD.result);

                  // Problemas enlace_churubusco_arista
                  const problems = await this.zabbixService.getProblems(element.nombre_equipo_origen == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14099, element.descripcion_interface_origen);
                  const problemsD = await this.zabbixService.getProblems(element.nombre_equipo_destino == 'ARISTA_DALLAS_7280CR3K_CA.TPENLACE' ? 14101 : 14099, element.descripcion_interface_destino);

                  console.log('Problemas enlaces enlace_churubusco_arista:', problems);

                  if (ca == 0) {
                    txtInterfaces_churubusco_arista = txtInterfaces_churubusco_arista + '<thead><tr><th class="text-center"><b>Origen</b></th><th class="text-center"><b>Destino</b></th></tr></thead><tbody><tr><td><b>' + element.nombre_equipo_origen + '</b></td><td><b>' + element.nombre_equipo_destino + '</b></td></tr>';
                  }

                  if ((respO.result.length == 0 && respD.result.length == 0) || (problems.result.length > 0 && problemsD.result.length > 0)) {
                    problemas_churubusco_arista = true;
                    totalProblemas_churubusco_arista++;
                    txtInterfaces_churubusco_arista = txtInterfaces_churubusco_arista + '<tr><td class="text-danger">' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
                  } else if ((respO.result.length > 0 && respD.result.length == 0) || (problems.result.length == 0 && problemsD.result.length > 0)) {
                    problemas_churubusco_arista = true;
                    txtInterfaces_churubusco_arista = txtInterfaces_churubusco_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td class="text-danger">' + element.descripcion_interface_destino + '</td></tr>';
                  } else {
                    txtInterfaces_churubusco_arista = txtInterfaces_churubusco_arista + '<tr><td>' + element.descripcion_interface_origen + '</td><td>' + element.descripcion_interface_destino + '</td></tr>';
                  }

                  this.arrChurubusco[0]['problemas_enlace_qro'] = problemas_churubusco_qro;
                  this.arrChurubusco[0]['ancho_banda_total_churubusco_churubusco'] = ancho_banda_churubusco_qro + umedida_churubusco_qro;
                  this.arrChurubusco[0]['interfaces_churubusco_qro'] = txtInterfaces_churubusco_qro;
                  this.arrChurubusco[0]['problemas_enlace_arista'] = problemas_churubusco_arista;
                  this.arrChurubusco[0]['interfaces_churubusco_arista'] = txtInterfaces_churubusco_arista;
                  this.arrChurubusco[0]['ancho_banda_total_churubusco_arista'] = ancho_banda_churubusco_arista + umedida_churubusco_arista;
                  this.arrChurubusco[0]['color_problemas_churubusco_arista'] = problemas_churubusco_arista ? totalProblemas_churubusco_arista == enlace_churubusco_arista.length ? '#ff0000' : '#fff200' : '';

                  ca++;
                  k++;
                  if (enlace_churubusco_arista.length == k) {
                    console.log('arrChurubusco', this.arrChurubusco);
                    var treeData = this.getTreeData();
                    this.loadVisTree(treeData);     // RENDER STANDARD NODES WITH TEXT LABEL
                  }

                });
              } else {
                this.arrChurubusco[0]['problemas_enlace_arista'] = false;
                this.arrChurubusco[0]['interfaces_churubusco_arista'] = '';
                this.arrChurubusco[0]['ancho_banda_total_churubusco_arista'] = '';
                var treeData = this.getTreeData();
                this.loadVisTree(treeData);     // RENDER STANDARD NODES WITH TEXT LABEL
              }
            }

          });
        } else {
          this.arrChurubusco[0]['problemas_enlace_qro'] = false;
          this.arrChurubusco[0]['ancho_banda_total_churubusco_churubusco'] = '';
          this.arrChurubusco[0]['interfaces_churubusco_qro'] = '';
          this.arrChurubusco[0]['problemas_enlace_arista'] = false;
          this.arrChurubusco[0]['interfaces_churubusco_arista'] = '';
          this.arrChurubusco[0]['ancho_banda_total_churubusco_arista'] = '';

          var treeData = this.getTreeData();
          this.loadVisTree(treeData);     // RENDER STANDARD NODES WITH TEXT LABEL
        }
      }

    });

  }

  async arista() {
    this.arrModalPeerings = [];
    // Peerings
    const peering = await this.zabbixService.getPeering();
    console.log('Peerings All', peering);

    // Zabbix login
    const authResponse = await this.zabbixService.authenticate();
    this.zabbixService.setAuthToken(authResponse.result);

    // Peerings Arista
    const peering_Arista = await peering.filter(x => x.device_name == "ARISTA_DALLAS_7280CR3K_CA.TPENLACE");
    console.log("Peerings Arista:", peering_Arista);

    let arr_datos_arista = await this.zabbixService.getHost(14101);
    console.log(arr_datos_arista);

    let txtPeerings = '<table><tr><td>Dispositivo</td><td>Interface</td><td>Proveedor</td></tr>';
    let ancho_banda_arista = peering_Arista.length >= 10 ? peering_Arista.length / 10 : peering_Arista.length * 100;
    let umedida_arista = peering_Arista.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_peerings_arista = peering_Arista.length > 0 ? 0 : 2;

    let ar = 0;
    await peering_Arista.forEach(async element => {
      console.log("Peering Arista: ", element);

      const respO = await this.zabbixService.getItemInterface(14101, element.interface_description);
      console.log("Resp Interfaces Peering Arista: ", respO.result);

      const problems = await this.zabbixService.getProblems(14101, element.interface_description);

      console.log('Problemas enlaces peering_Arista:', problems);

      if (respO.result.length == 0) {
        problemas_peerings_arista = 1;
        this.arrModalPeerings.push({
          device_name: element.device_name,
          interface_description: element.interface_description,
          provider_name: element.provider_name,
          error: 1
        });
        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      } else {
        this.arrModalPeerings.push({
          device_name: element.device_name,
          interface_description: element.interface_description,
          provider_name: element.provider_name,
          error: 0
        });
        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

      ar++;
      if (peering_Arista.length == ar) {
        // Peerings Buenos Aires
        const peering_ba = await peering.filter(x => x.device_name == "POP_BUEAIR-NVL4038-NE-X8A-CA");
        console.log("Peerings BuenosAires:", peering_ba);

        let ancho_banda_ba = peering_ba.length >= 10 ? peering_ba.length / 10 : peering_ba.length * 100;
        let umedida_ba = peering_ba.length >= 10 ? 'Tbps' : 'Gbps';
        let problemas_peerings_ba = peering_ba.length > 0 ? 0 : 2;

        let ba = 0;
        await peering_ba.forEach(async element => {
          console.log("Peering BA: ", element);

          const respO = await this.zabbixService.getItemInterface(14107, element.interface_description);
          console.log("Resp Interfaces Peering BA: ", respO.result);

          const problems = await this.zabbixService.getProblems(14107, element.interface_description ? element.interface_description : element.interface_description.split('_')[2]);

          console.log('Problemas enlaces peering_ba:', problems);

          if (respO.result.length == 0) {
            problemas_peerings_ba = 1;
            this.arrModalPeerings.push({
              device_name: element.device_name,
              interface_description: element.interface_description,
              provider_name: element.provider_name,
              error: 1
            });
            txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
          } else {
            this.arrModalPeerings.push({
              device_name: element.device_name,
              interface_description: element.interface_description,
              provider_name: element.provider_name,
              error: 0
            });
            txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
          }

          ba++;

          if (peering_ba.length == ba) {
            // Peerings HostDime
            const peering_HostDime = await peering.filter(x => x.device_name == "POP-HOST-DIME-GDL-NE40-X8A-CA");
            console.log("Peerings HostDime:", peering_ba);

            let ancho_banda_HostDime = peering_HostDime.length >= 10 ? peering_HostDime.length / 10 : peering_HostDime.length * 100;
            let umedida_HostDime = peering_HostDime.length >= 10 ? 'Tbps' : 'Gbps';
            let problemas_peerings_HostDime = peering_HostDime.length > 0 ? 0 : 2;

            let hd = 0;
            await peering_HostDime.forEach(async element => {
              console.log("Peering HostDime: ", element);

              const respO = await this.zabbixService.getItemInterface(14105, element.interface_description);
              console.log("Resp Interfaces Peering HostDime: ", respO.result);

              const problems = await this.zabbixService.getProblems(14105, element.interface_description ? element.interface_description : element.interface_description.split('_')[1]);

              console.log('Problemas enlaces peering_HostDime:', problems);

              if (respO.result.length == 0) {
                problemas_peerings_HostDime = 1;
                this.arrModalPeerings.push({
                  device_name: element.device_name,
                  interface_description: element.interface_description,
                  provider_name: element.provider_name,
                  error: 1
                });
                txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
              } else {
                this.arrModalPeerings.push({
                  device_name: element.device_name,
                  interface_description: element.interface_description,
                  provider_name: element.provider_name,
                  error: 0
                });
                txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
              }

              hd++;
              if (peering_HostDime.length == hd) {
                // Peerings Tlaquepaque
                const peering_Tlaquepaque = await peering.filter(x => x.device_name == "POP_TLAQUE-JAL86450-X16A-CA");
                console.log("Peerings Tlaquepaque:", peering_Tlaquepaque);

                let ancho_banda_Tlaquepaque = peering_Tlaquepaque.length >= 10 ? peering_Tlaquepaque.length / 10 : peering_Tlaquepaque.length * 100;
                let problemas_peerings_Tlaquepaque = peering_Tlaquepaque.length > 0 ? 0 : 2;

                let tla = 0;
                await peering_Tlaquepaque.forEach(async element => {
                  console.log("Peering Tlaquepaque: ", element);

                  const respO = await this.zabbixService.getItemInterface(14102, element.interface_description);
                  console.log("Resp Interfaces Peering Tlaquepaque: ", respO.result);

                  const problems = await this.zabbixService.getProblems(14102, element.interface_description ? element.interface_description : element.interface_description.split('_')[2]);

                  console.log('Problemas enlaces peering_Tlaquepaque:', problems);

                  if (respO.result.length == 0) {
                    problemas_peerings_Tlaquepaque = 1;
                    this.arrModalPeerings.push({
                      device_name: element.device_name,
                      interface_description: element.interface_description,
                      provider_name: element.provider_name,
                      error: 1
                    });
                    txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                  } else {
                    this.arrModalPeerings.push({
                      device_name: element.device_name,
                      interface_description: element.interface_description,
                      provider_name: element.provider_name,
                      error: 0
                    });
                    txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                  }

                  tla++;
                  if (peering_Tlaquepaque.length == tla) {
                    // Peerings Kio Mty
                    const peering_Mty = await peering.filter(x => x.device_name == "POP_KIO-MTY-NE40E-X8A-CA");
                    console.log("Peerings Kio Mty:", peering_Mty);

                    let ancho_banda_Mty = peering_Mty.length >= 10 ? peering_Mty.length / 10 : peering_Mty.length * 100;
                    let problemas_peerings_Mty = peering_Mty.length > 0 ? 0 : 2;

                    let mty = 0;
                    await peering_Mty.forEach(async element => {
                      console.log("Peering Kio Mty: ", element);

                      const respO = await this.zabbixService.getItemInterface(14102, element.interface_description);
                      console.log("Resp Interfaces Peering Kio Mty: ", respO.result);

                      const problems = await this.zabbixService.getProblems(14102, element.interface_description ? element.interface_description : element.interface_description.split('_')[2]);

                      console.log('Problemas enlaces peering_Mty:', problems);

                      if (respO.result.length == 0) {
                        problemas_peerings_Mty = 1;
                        this.arrModalPeerings.push({
                          device_name: element.device_name,
                          interface_description: element.interface_description,
                          provider_name: element.provider_name,
                          error: 1
                        });
                        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                      } else {
                        this.arrModalPeerings.push({
                          device_name: element.device_name,
                          interface_description: element.interface_description,
                          provider_name: element.provider_name,
                          error: 0
                        });
                        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                      }

                      mty++;
                      if (peering_Mty.length == mty) {
                        // Peerings Tlalnepantla
                        const peering_Tlalnepantla = await peering.filter(x => x.device_name == "POP-TLALNE-NE-X16A");
                        console.log("Peerings Tlalnepantla:", peering_Tlalnepantla);

                        let ancho_banda_Tlalnepantla = peering_Tlalnepantla.length >= 10 ? peering_Tlalnepantla.length / 10 : peering_Tlalnepantla.length * 100;
                        let problemas_peerings_Tlalnepantla = peering_Tlalnepantla.length > 0 ? 0 : 2;

                        let tlalne = 0;
                        await peering_Tlalnepantla.forEach(async element => {
                          console.log("Peering Tlalnepantla: ", element);

                          const respO = await this.zabbixService.getItemInterface(14103, element.interface_description);
                          console.log("Resp Interfaces Peering Tlalnepantla: ", respO.result);

                          const problems = await this.zabbixService.getProblems(14103, element.interface_description ? element.interface_description : element.interface_description.split('_')[1]);

                          console.log('Problemas enlaces peering_Tlalnepantla:', problems);

                          if (respO.result.length == 0) {
                            problemas_peerings_Tlalnepantla = 1;
                            this.arrModalPeerings.push({
                              device_name: element.device_name,
                              interface_description: element.interface_description,
                              provider_name: element.provider_name,
                              error: 1
                            });
                            txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                          } else {
                            this.arrModalPeerings.push({
                              device_name: element.device_name,
                              interface_description: element.interface_description,
                              provider_name: element.provider_name,
                              error: 0
                            });
                            txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                          }

                          tlalne++;
                          if (peering_Tlalnepantla.length == tlalne) {
                            // Peerings Churubusco
                            const peering_Churubusco = await peering.filter(x => x.device_name == "POP-CHURUB-NE40-X8A");
                            console.log("Peerings Churubusco:", peering_Churubusco);

                            let ancho_banda_Churubusco = peering_Churubusco.length >= 10 ? peering_Churubusco.length / 10 : peering_Churubusco.length * 100;
                            let problemas_peerings_Churubusco = peering_Churubusco.length > 0 ? 0 : 2;

                            let chu = 0;
                            await peering_Churubusco.forEach(async element => {
                              console.log("Peering Churubusco: ", element);

                              const respO = await this.zabbixService.getItemInterface(14099, element.interface_description);
                              console.log("Resp Interfaces Peering Churubusco: ", respO.result);

                              const problems = await this.zabbixService.getProblems(14099, element.interface_description ? element.interface_description : element.interface_description.split('_')[1]);

                              console.log('Problemas enlaces peering_Churubusco:', problems);

                              if (respO.result.length == 0) {
                                problemas_peerings_Churubusco = 1;
                                this.arrModalPeerings.push({
                                  device_name: element.device_name,
                                  interface_description: element.interface_description,
                                  provider_name: element.provider_name,
                                  error: 1
                                });
                                txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                              } else {
                                this.arrModalPeerings.push({
                                  device_name: element.device_name,
                                  interface_description: element.interface_description,
                                  provider_name: element.provider_name,
                                  error: 0
                                });
                                txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
                              }

                              chu++;
                              if (peering_Churubusco.length == chu) {
                                // Arreglo final
                                let problemasPeerings = 0;
                                let anchoBanda = 0;
                                let anchoBandaTotal = 0;
                                let unidadMedida = '';
                                if (problemas_peerings_arista == 1 || problemas_peerings_ba == 1 || problemas_peerings_HostDime == 1
                                  || problemas_peerings_Tlaquepaque == 1 || problemas_peerings_Mty == 1 || problemas_peerings_Tlalnepantla == 1
                                  || problemas_peerings_Churubusco == 1) {
                                  problemasPeerings = 1;
                                }

                                anchoBanda = peering_Arista.length + peering_ba.length + peering_HostDime.length +
                                  peering_Tlaquepaque.length + peering_Mty.length + peering_Tlalnepantla.length + peering_Churubusco.length;
                                anchoBandaTotal = anchoBanda > 10 ? anchoBanda / 10 : anchoBanda * 100;
                                unidadMedida = anchoBanda < 10 ? 'Gbps' : 'Tbps';


                                this.arrArista[0]['interfaces_peerings'] = txtPeerings;
                                this.arrArista[0]['problemas_peerings'] = problemasPeerings;
                                this.arrArista[0]['ancho_banda_total'] = anchoBandaTotal + unidadMedida;
                                this.arrArista[0]['host'] = arr_datos_arista.result.length > 0 ? arr_datos_arista.result[0].name + '\n' + arr_datos_arista.result[0].interfaces[0].ip : '';

                                this.arrModalPeerings.sort((a, b) => b.error - a.error);
                              }

                            });
                          }

                        });
                      }

                    });
                  }

                });
              }

            });
          }

        });
      }

    });








  }

  async kioqro() {
    this.arrModalPeeringsKioQro = [];
    // Peerings
    const peering = await this.zabbixService.getPeering();
    console.log('Peerings Kio Qro', peering);

    // Zabbix login
    const authResponse = await this.zabbixService.authenticate();
    this.zabbixService.setAuthToken(authResponse.result);

    // Peerings Arista
    const peering_KioQro = await peering.filter(x => x.device_name == "KIO-QRO-NE-X8-CA");
    console.log("Peerings KioQro:", peering_KioQro);

    let arr_datos_kioqro = await this.zabbixService.getHost(14104);
    console.log(arr_datos_kioqro);

    let txtPeerings = '<table><tr><td>Dispositivo</td><td>Interface</td><td>Proveedor</td></tr>';
    let ancho_banda_arista = peering_KioQro.length >= 10 ? peering_KioQro.length / 10 : peering_KioQro.length * 100;
    let umedida_arista = peering_KioQro.length >= 10 ? 'Tbps' : 'Gbps';
    let problemas_peerings_kioqro = peering_KioQro.length > 0 ? 0 : 2;

    let ar = 0;
    await peering_KioQro.forEach(async element => {
      console.log("Peering Arista: ", element);

      const respO = await this.zabbixService.getItemInterface(14104, element.interface_description);
      console.log("Resp Interfaces Peering Kio Qro: ", respO.result);

      const problems = await this.zabbixService.getProblems(14104, element.interface_description);

      console.log('Problemas enlaces peering_KioQro:', problems);

      if (respO.result.length == 0) {
        problemas_peerings_kioqro = 1;
        this.arrModalPeeringsKioQro.push({
          device_name: element.device_name,
          interface_description: element.interface_description,
          provider_name: element.provider_name,
          error: 1
        });
        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      } else {
        this.arrModalPeeringsKioQro.push({
          device_name: element.device_name,
          interface_description: element.interface_description,
          provider_name: element.provider_name,
          error: 0
        });
        txtPeerings = txtPeerings + '<tr><td>' + element.device_name + '</td><td>' + element.interface_description + '</td><td>' + element.provider_name + '</td></tr>';
      }

      ar++;
      if (peering_KioQro.length == ar) {
        // Arreglo final
        let problemasPeerings = 0;
        let anchoBanda = 0;
        let anchoBandaTotal = 0;
        let unidadMedida = '';
        if (problemas_peerings_kioqro == 1) {
          problemasPeerings = 1;
        }

        anchoBanda = peering_KioQro.length;
        anchoBandaTotal = anchoBanda > 10 ? anchoBanda / 10 : anchoBanda * 100;
        unidadMedida = anchoBanda < 10 ? 'Gbps' : 'Tbps';


        this.arrKioQro[0]['interfaces_peerings'] = txtPeerings;
        this.arrKioQro[0]['problemas_peerings'] = problemasPeerings;
        this.arrKioQro[0]['ancho_banda_total'] = anchoBandaTotal + unidadMedida;
        this.arrKioQro[0]['host'] = arr_datos_kioqro.result.length > 0 ? arr_datos_kioqro.result[0].name + '\n' + arr_datos_kioqro.result[0].interfaces[0].ip : '';

        this.arrModalPeeringsKioQro.sort((a, b) => b.error - a.error);

      }

    });

  }

  getTreeData() {

    var nodes = [
      { // Arista
        id: 1,
        label: '\nArista\nEquinix Dallas',
        title: this.arrArista[0].host,
        shape: 'image',
        size: 35,
        image: './assets/img/peerings.svg',
        level: 0,
        x: 0,
        y: -350,
        fixed: { x: true, y: true },
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000',
          color:'#ffffff',
          hover: {
            background: "#000000",
            border: "#000000"
          }
        },
        font: {
          color: '#ffffff',
          size: 17
        }
      },
      { // HostDime
        id: 2,
        label: 'HostDime                                 \n(R5/R6)                                 ',
        title: this.arrHostDime[0].host,
        shape: 'image',
        // image: this.arrHostDime[0]['problemas_enlace'] ? './assets/img/Router-Down.svg' : './assets/img/Router-Up.svg',
        image: './assets/img/Router-Up.svg',
        level: 1,
        x: -150,
        y: -200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17,
          vadjust: -20
        }
      },
      { // Buenos Aires
        id: 3,
        label: '                                          Buenos Aires\n                                           (R4)',
        title: this.arrBuenosAires[0].host,
        shape: 'image',
        image: './assets/img/Router-Up.svg',
        level: 1,
        x: 150,
        y: -200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17,
          vadjust: -20
        }
      },
      { // Kio Querétaro
        id: 4,
        label: '\nKio\nQuerétaro\n(Peerings)',
        title: this.arrKioQro[0].host,
        shape: 'image',
        size: 35,
        image: './assets/img/peerings.svg',
        level: 2,
        x: 0,
        y: 0,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff'
        }
      },
      { // Tlaquepaque
        id: 5,
        label: 'Tlaquepaque                   \n(R5/R6)                   ',
        title: this.arrTlaquepaque[0].host,
        shape: 'image',
        image: './assets/img/Router-Up.svg',
        level: 2,
        x: -250,
        y: 0,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17
        }
      },
      { // Kio Monterrey
        id: 6,
        label: '               Kio Monterrey\n               (R4)',
        title: this.arrKioMty[0].host,
        shape: 'image',
        image: './assets/img/Router-Up.svg',
        level: 2,
        x: 250,
        y: 0,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17
        }
      },
      { // Tlalnepantla
        id: 7,
        label: 'Tlalnepantla\n(R9/R7)',
        title: this.arrTlalnepantla[0].host,
        shape: 'image',
        image: './assets/img/Router-Up.svg',
        level: 3,
        x: -150,
        y: 200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17
        }
      },
      { // Churubusco
        id: 8,
        label: 'Churubusco\n(R9/R7)',
        title: this.arrChurubusco[0].host,
        shape: 'image',
        image: './assets/img/Router-Up.svg',
        level: 3,
        x: 150,
        y: 200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#6b6b6b',
          size: 17
        }
      },
      { // ISP HostDime
        id: 9,
        label: 'Internet\n' + this.arrHostDime[0]['ancho_banda_total_isp'],
        // label: 'Internet',
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 1,
        x: -350,
        y: -200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      { // ISP Buenos Aires
        id: 10,
        label: 'Internet\n' + this.arrBuenosAires[0]['ancho_banda_total_isp'],
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 1,
        x: 350,
        y: -200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      { // ISP Tlaquepaque
        id: 12,
        label: 'Internet\n' + this.arrTlaquepaque[0]['ancho_banda_total_isp'],
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 3,
        x: -400,
        y: -100,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      { // ISP Kio Monterrey
        id: 13,
        label: 'Internet\n' + this.arrKioMty[0]['ancho_banda_total_isp'],
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 2,
        x: 400,
        y: -100,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      { // ISP Tlalnepantla
        id: 14,
        label: 'Internet\n' + this.arrTlalnepantla[0]['ancho_banda_total_isp'],
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 2,
        x: -350,
        y: 200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      { // ISP Churubusco
        id: 15,
        label: 'Internet\n' + this.arrChurubusco[0]['ancho_banda_total_isp'],
        shape: 'image',
        image: './assets/img/isp.svg',
        level: 3,
        x: 350,
        y: 200,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#ffffff',
          vadjust: -25
        }
      },
      {
        id: 16,
        label: 'CDMX',
        x: 0,
        y: 300,
        level: 3,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#b3b300',
          size: 30
        }
      },
      {
        id: 17,
        label: 'Guadalajara',
        x: -550,
        y: 100,
        level: 3,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#b3b300',
          size: 30
        }
      },
      {
        id: 18,
        label: 'Monterrey',
        x: 550,
        y: 100,
        level: 3,
        shapeProperties: {
          coordinateOrigin: "center"
        },
        color: {
          background: '#000000'
        },
        hover: {
          background: "#000000",
          border: "#000000"
        },
        font: {
          color: '#b3b300',
          size: 30
        }
      },
      // { // Peerings Arista
      //   id: 19,
      //   label: '                                  Peerings',
      //   title: '',
      //   shape: 'image',
      //   size: 35,
      //   image: './assets/img/peerings.svg',
      //   level: 0,
      //   x: 0,
      //   y: -500,
      //   fixed: { x: true, y: true },
      //   shapeProperties: {
      //     coordinateOrigin: "center"
      //   },
      //   color: {
      //     background: '#000000',
      //     hover: {
      //       background: "#000000",
      //       border: "#000000"
      //     }
      //   },
      //   font: {
      //     color: '#ffffff',
      //     size: 17,
      //     vadjust: -53
      //   }
      // },
      // { // Peerings Kio Qro
      //   id: 20,
      //   label: 'Peerings',
      //   title: '',
      //   shape: 'image',
      //   size: 35,
      //   image: './assets/img/peerings.svg',
      //   level: 0,
      //   x: 0,
      //   y: -160,
      //   fixed: { x: true, y: true },
      //   shapeProperties: {
      //     coordinateOrigin: "center"
      //   },
      //   color: {
      //     background: '#000000',
      //     hover: {
      //       background: "#000000",
      //       border: "#000000"
      //     }
      //   },
      //   font: {
      //     color: '#ffffff',
      //     size: 17,
      //     vadjust: -100
      //   }
      // },
    ];

    // create an array with edges
    var edges = [
      { // Arista a HostDime
        from: 1,
        to: 2,
        color: {
          color: this.arrHostDime[0]['problemas_enlace'] == 1 ? this.arrHostDime[0]['color_problemas_arista_hostdime'] : this.arrHostDime[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          hover: this.arrHostDime[0]['problemas_enlace'] == 1 ? this.arrHostDime[0]['color_problemas_arista_hostdime'] : this.arrHostDime[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          highlight:this.arrHostDime[0]['problemas_enlace'] == 1 ? this.arrHostDime[0]['color_problemas_arista_hostdime'] : this.arrHostDime[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          // color: this.arrHostDime[0]['problemas_enlace'] ? '#ff0000' : '#08ff08',
          // hover: this.arrHostDime[0]['problemas_enlace'] ? '#ff0000' : '#08ff08'
        },
        label: this.arrHostDime[0]['ancho_banda_total'],
        title: this.htmlTitle(this.arrHostDime[0]['interfaces']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Arista a Buenos aires
        from: 1,
        to: 3,
        color: {
          color: this.arrBuenosAires[0]['problemas_enlace'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_arista'] : this.arrBuenosAires[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          hover: this.arrBuenosAires[0]['problemas_enlace'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_arista'] : this.arrBuenosAires[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          highlight: this.arrBuenosAires[0]['problemas_enlace'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_arista'] : this.arrBuenosAires[0]['problemas_enlace'] == 2 ? '#6b6b6b' : '#08ff08',
          // color: this.arrBuenosAires[0]['problemas_enlace'] ? '#ff0000' : '#08ff08',
          // hover: this.arrBuenosAires[0]['problemas_enlace'] ? '#ff0000' : '#08ff08',
        },
        label: this.arrBuenosAires[0]['ancho_banda_total'],
        title: this.htmlTitle(this.arrBuenosAires[0]['interfaces']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // HostDime a QRO
        from: 2,
        to: 4,
        color: {
          // color: this.arrHostDime[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrHostDime[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrHostDime[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrHostDime[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrHostDime[0]['problemas_enlace_qro'] ? this.arrHostDime[0]['color_problemas_hostdime_qro'] : '#08ff08',
          hover: this.arrHostDime[0]['problemas_enlace_qro'] ? this.arrHostDime[0]['color_problemas_hostdime_qro'] : '#08ff08',
          highlight: this.arrHostDime[0]['problemas_enlace_qro'] ? this.arrHostDime[0]['color_problemas_hostdime_qro'] : '#08ff08',
        },
        label: this.arrHostDime[0]['ancho_banda_total_hostdime_qro'],
        title: this.htmlTitle(this.arrHostDime[0]['interfaces_hostdime_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Buenos aires a QRO
        from: 3,
        to: 4,
        color: {
          color: this.arrBuenosAires[0]['problemas_enlace_qro'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_qro'] : this.arrBuenosAires[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          hover: this.arrBuenosAires[0]['problemas_enlace_qro'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_qro'] : this.arrBuenosAires[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          highlight: this.arrBuenosAires[0]['problemas_enlace_qro'] == 1 ? this.arrBuenosAires[0]['color_problemas_ba_qro'] : this.arrBuenosAires[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          // color: this.arrBuenosAires[0]['problemas_enlace_qro'] ? '#ff0000' : '#08ff08',
          // hover: this.arrBuenosAires[0]['problemas_enlace_qro'] ? '#ff0000' : '#08ff08',
        },
        label: this.arrBuenosAires[0]['ancho_banda_total_ba_qro'],
        title: this.htmlTitle(this.arrBuenosAires[0]['interfaces_ba_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Buenos Aires a MTY
        from: 3,
        to: 6,
        color: {
          // color: this.arrBuenosAires[0]['problemas_enlace_kiomty'] ? '#ff0000' : this.arrBuenosAires[0]['problemas_enlace_kiomty'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrBuenosAires[0]['problemas_enlace_kiomty'] ? '#ff0000' : this.arrBuenosAires[0]['problemas_enlace_kiomty'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrBuenosAires[0]['problemas_enlace_kiomty'] ? this.arrBuenosAires[0]['color_problemas_ba_kiomty'] : '#08ff08',
          hover: this.arrBuenosAires[0]['problemas_enlace_kiomty'] ? this.arrBuenosAires[0]['color_problemas_ba_kiomty'] : '#08ff08',
          highlight: this.arrBuenosAires[0]['problemas_enlace_kiomty'] ? this.arrBuenosAires[0]['color_problemas_ba_kiomty'] : '#08ff08',
        },
        label: this.arrBuenosAires[0]['ancho_banda_total_ba_kiomty'],
        title: this.htmlTitle(this.arrBuenosAires[0]['interfaces_ba_kiomty']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // QRO a Tlaquepaque
        from: 5,
        to: 4,
        color: {
          color: this.arrTlaquepaque[0]['problemas_enlace_qro'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_qro'] : this.arrTlaquepaque[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          hover: this.arrTlaquepaque[0]['problemas_enlace_qro'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_qro'] : this.arrTlaquepaque[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          highlight: this.arrTlaquepaque[0]['problemas_enlace_qro'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_qro'] : this.arrTlaquepaque[0]['problemas_enlace_qro'] == 2 ? '#6b6b6b' : '#08ff08',
          // color: this.arrTlaquepaque[0]['problemas_enlace_qro'] ? '#ff0000' : '#08ff08',
          // hover: this.arrTlaquepaque[0]['problemas_enlace_qro'] ? '#ff0000' : '#08ff08',
        },
        label: this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_qro'],
        title: this.htmlTitle(this.arrTlaquepaque[0]['interfaces_tlaquepaque_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'bottom',
          size: 12,
          vadjust: 10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // QRO a MTY
        from: 4,
        to: 6,
        color: {
          // color: this.arrKioMty[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrKioMty[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrKioMty[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrKioMty[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrKioMty[0]['problemas_enlace_qro'] ? this.arrKioMty[0]['color_problemas_mty_qro'] : '#08ff08',
          hover: this.arrKioMty[0]['problemas_enlace_qro'] ? this.arrKioMty[0]['color_problemas_mty_qro'] : '#08ff08',
          highlight: this.arrKioMty[0]['problemas_enlace_qro'] ? this.arrKioMty[0]['color_problemas_mty_qro'] : '#08ff08',
        },
        label: this.arrKioMty[0]['ancho_banda_total_mty_qro'],
        title: this.htmlTitle(this.arrKioMty[0]['interfaces_mty_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'bottom',
          size: 12,
          vadjust: 10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // HostDime a Tlaquepaque
        from: 2,
        to: 5,
        color: {
          // color: this.arrHostDime[0]['problemas_enlace_tlaquepaque'] ? '#ff0000' : this.arrHostDime[0]['problemas_enlace_tlaquepaque'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrHostDime[0]['problemas_enlace_tlaquepaque'] ? '#ff0000' : this.arrHostDime[0]['problemas_enlace_tlaquepaque'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrHostDime[0]['problemas_enlace_tlaquepaque'] ? this.arrHostDime[0]['color_problemas_hostdime_tlaquepaque'] : '#08ff08',
          hover: this.arrHostDime[0]['problemas_enlace_tlaquepaque'] ? this.arrHostDime[0]['color_problemas_hostdime_tlaquepaque'] : '#08ff08',
          highlight: this.arrHostDime[0]['problemas_enlace_tlaquepaque'] ? this.arrHostDime[0]['color_problemas_hostdime_tlaquepaque'] : '#08ff08',
        },
        label: this.arrHostDime[0]['ancho_banda_total_hostdime_tlaquepaque'],
        title: this.htmlTitle(this.arrHostDime[0]['interfaces_hostdime_tlaquepque']),
        font:
        {
          color: '#ffffff',
          background: "#000000",
          align: 'bottom',
          size: 12,
          vadjust: 10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // QRO a Tlalnepantla
        from: 4,
        to: 7,
        color: {
          // color: this.arrTlalnepantla[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrTlalnepantla[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrTlalnepantla[0]['problemas_enlace_qro'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_qro'] : '#08ff08',
          hover: this.arrTlalnepantla[0]['problemas_enlace_qro'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_qro'] : '#08ff08',
          highlight: this.arrTlalnepantla[0]['problemas_enlace_qro'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_qro'] : '#08ff08'
        },
        label: this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_qro'],
        title: this.htmlTitle(this.arrTlalnepantla[0]['interfaces_tlalnepantla_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // QRO a Churubusco
        from: 4,
        to: 8,
        color: {
          // color: this.arrChurubusco[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrChurubusco[0]['problemas_enlace_qro'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_qro'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrChurubusco[0]['problemas_enlace_qro'] ? this.arrChurubusco[0]['color_problemas_churubusco_qro'] : '#08ff08',
          hover: this.arrChurubusco[0]['problemas_enlace_qro'] ? this.arrChurubusco[0]['color_problemas_churubusco_qro'] : '#08ff08',
          highlight: this.arrChurubusco[0]['problemas_enlace_qro'] ? this.arrChurubusco[0]['color_problemas_churubusco_qro']  : '#08ff08'
        },
        label: this.arrChurubusco[0]['ancho_banda_total_churubusco_churubusco'],
        title: this.htmlTitle(this.arrChurubusco[0]['interfaces_churubusco_qro']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Tlalnepantla a Churubusco
        from: 7,
        to: 8,
        color: {
          // color: this.arrTlalnepantla[0]['problemas_enlace_churubusco'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_churubusco'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrTlalnepantla[0]['problemas_enlace_churubusco'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_churubusco'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrTlalnepantla[0]['problemas_enlace_churubusco'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_churubusco'] : '#08ff08',
          hover: this.arrTlalnepantla[0]['problemas_enlace_churubusco'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_churubusco'] : '#08ff08',
          highlight: this.arrTlalnepantla[0]['problemas_enlace_churubusco'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_churubusco'] : '#08ff08'
        },
        label: this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_churubusco'],
        title: this.htmlTitle(this.arrTlalnepantla[0]['interfaces_tlalnepantla_churubusco']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Tlaquepaque a Arista
        from: 5,
        to: 1,
        smooth: {
          enabled: true, type:
            'curvedCW',
          roundness: '-4.7'
        },
        color: {
          color: this.arrTlaquepaque[0]['problemas_enlace_arista'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_arista'] : this.arrTlaquepaque[0]['problemas_enlace_arista'] == 2 ? '#6b6b6b' : '#08ff08',
          hover: this.arrTlaquepaque[0]['problemas_enlace_arista'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_arista'] : this.arrTlaquepaque[0]['problemas_enlace_arista'] == 2 ? '#6b6b6b' : '#08ff08',
          highlight: this.arrTlaquepaque[0]['problemas_enlace_arista'] == 1 ? this.arrTlaquepaque[0]['color_problemas_tlaquepaque_arista'] : this.arrTlaquepaque[0]['problemas_enlace_arista'] == 2 ? '#6b6b6b' : '#08ff08',
          // color: this.arrTlaquepaque[0]['problemas_enlace_arista'] ? '#ff0000' : '#08ff08',
          // hover: this.arrTlaquepaque[0]['problemas_enlace_arista'] ? '#ff0000' : '#08ff08'
        },
        label: this.arrTlaquepaque[0]['ancho_banda_total_tlaquepaque_arista'],
        title: this.htmlTitle(this.arrTlaquepaque[0]['interfaces_tlaquepaque_arista']),
        font:
        {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: 30,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // MTY a aArista
        from: 6,
        to: 1,
        smooth: {
          enabled: true, type: 'curvedCCW',
          roundness: '-4.7'
        },
        color: {
          // color: this.arrKioMty[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrKioMty[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrKioMty[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrKioMty[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrKioMty[0]['problemas_enlace_arista'] ? this.arrKioMty[0]['color_problemas_mty_arista'] : '#08ff08',
          hover: this.arrKioMty[0]['problemas_enlace_arista'] ? this.arrKioMty[0]['color_problemas_mty_arista'] : '#08ff08',
          highlight: this.arrKioMty[0]['problemas_enlace_arista'] ? this.arrKioMty[0]['color_problemas_mty_arista'] : '#08ff08'
        },
        label: this.arrKioMty[0]['ancho_banda_total_mty_arista'],
        title: this.htmlTitle(this.arrKioMty[0]['interfaces_mty_arista']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: 30,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Tlalnepantla a Arista
        from: 7,
        to: 1,
        smooth: {
          enabled: true, type: 'curvedCCW',
          roundness: '3.1'
        },
        color: {
          // color: this.arrTlalnepantla[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrTlalnepantla[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrTlalnepantla[0]['problemas_enlace_arista'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_arista'] : '#08ff08',
          hover: this.arrTlalnepantla[0]['problemas_enlace_arista'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_arista'] : '#08ff08',
          highlight: this.arrTlalnepantla[0]['problemas_enlace_arista'] ? this.arrTlalnepantla[0]['color_problemas_tlalnepantla_arista'] : '#08ff08'
        },
        label: this.arrTlalnepantla[0]['ancho_banda_total_tlalnepantla_arista'],
        title: this.htmlTitle(this.arrTlalnepantla[0]['interfaces_tlalnepantla_arista']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: 30,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Churubusco a Arista
        from: 8,
        to: 1,
        smooth: {
          enabled: true, type: 'curvedCW',
          roundness: '3.1'
        },
        color: {
          // color: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrChurubusco[0]['problemas_enlace_arista'] ? this.arrChurubusco[0]['color_problemas_churubusco_arista'] : '#08ff08',
          hover: this.arrChurubusco[0]['problemas_enlace_arista'] ? this.arrChurubusco[0]['color_problemas_churubusco_arista'] : '#08ff08',
          highlight: this.arrChurubusco[0]['problemas_enlace_arista'] ? this.arrChurubusco[0]['color_problemas_churubusco_arista'] : '#08ff08'
        },
        label: this.arrChurubusco[0]['ancho_banda_total_churubusco_arista'],
        title: this.htmlTitle(this.arrChurubusco[0]['interfaces_churubusco_arista']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: 30,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // HostDime a ISP
        from: 2,
        to: 9,
        color: {
          // color: this.arrHostDime[0]['problemas_isp'] ? '#ff0000' : this.arrHostDime[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrHostDime[0]['problemas_isp'] ? '#ff0000' : this.arrHostDime[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrHostDime[0]['problemas_isp'] ? this.arrHostDime[0]['color_problemas_isp'] : '#08ff08',
          hover: this.arrHostDime[0]['problemas_isp'] ? this.arrHostDime[0]['color_problemas_isp'] : '#08ff08',
          highlight: this.arrHostDime[0]['problemas_isp'] ? this.arrHostDime[0]['color_problemas_isp'] : '#08ff08'
        },
        // label: this.arrHostDime[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrHostDime[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Buenos aires a ISP
        from: 3,
        to: 10,
        color: {
          // color: this.arrBuenosAires[0]['problemas_isp'] ? '#ff0000' : this.arrBuenosAires[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrBuenosAires[0]['problemas_isp'] ? '#ff0000' : this.arrBuenosAires[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrBuenosAires[0]['problemas_isp'] ? this.arrBuenosAires[0]['color_problemas_isp_ba'] : '#08ff08',
          hover: this.arrBuenosAires[0]['problemas_isp'] ? this.arrBuenosAires[0]['color_problemas_isp_ba'] : '#08ff08',
          highlight: this.arrBuenosAires[0]['problemas_isp'] ? this.arrBuenosAires[0]['color_problemas_isp_ba'] : '#08ff08'
        },
        // label: this.arrBuenosAires[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrBuenosAires[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Tlaquepaque a ISP
        from: 5,
        to: 12,
        color: {
          // color: this.arrTlaquepaque[0]['problemas_isp'] ? '#ff0000' : this.arrTlaquepaque[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrTlaquepaque[0]['problemas_isp'] ? '#ff0000' : this.arrTlaquepaque[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrTlaquepaque[0]['problemas_isp'] ? this.arrTlaquepaque[0]['color_problemas_isp'] : '#08ff08',
          hover: this.arrTlaquepaque[0]['problemas_isp'] ? this.arrTlaquepaque[0]['color_problemas_isp'] : '#08ff08',
          highlight: this.arrTlaquepaque[0]['problemas_isp'] ? this.arrTlaquepaque[0]['color_problemas_isp'] : '#08ff08'
        },
        // label: this.arrTlaquepaque[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrTlaquepaque[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // MTY a ISP
        from: 6,
        to: 13,
        color:
        {
          // color: this.arrKioMty[0]['problemas_isp'] ? '#ff0000' : this.arrKioMty[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrKioMty[0]['problemas_isp'] ? '#ff0000' : this.arrKioMty[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrKioMty[0]['problemas_isp'] ? this.arrKioMty[0]['color_problemas_isp'] : '#08ff08',
          hover: this.arrKioMty[0]['problemas_isp'] ? this.arrKioMty[0]['color_problemas_isp'] : '#08ff08',
          highlight: this.arrKioMty[0]['problemas_isp'] ? this.arrKioMty[0]['color_problemas_isp'] : '#08ff08',
        },
        // label: this.arrKioMty[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrKioMty[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'top',
          size: 12,
          vadjust: -10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      { // Tlalnepantla a ISP
        from: 7,
        to: 14,
        id: 17,
        color:
        {
          // color: this.arrTlalnepantla[0]['problemas_isp'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrTlalnepantla[0]['problemas_isp'] ? '#ff0000' : this.arrTlalnepantla[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrTlalnepantla[0]['problemas_isp'] ? this.arrTlalnepantla[0]['color_problemas_isp'] : '#08ff08',
          hover: this.arrTlalnepantla[0]['problemas_isp'] ? this.arrTlalnepantla[0]['color_problemas_isp'] : '#08ff08',
          highlight: this.arrTlalnepantla[0]['problemas_isp'] ? this.arrTlalnepantla[0]['color_problemas_isp'] : '#08ff08',
        },
        // label: this.arrTlalnepantla[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrTlalnepantla[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'bottom',
          size: 12,
          vadjust: 220,
        },
        labelHighlightBold: false
      },
      { // Churbusco a ISP
        from: 8,
        to: 15,
        id: 18,
        color:
        {
          // color: this.arrChurubusco[0]['problemas_isp'] ? '#ff0000' : this.arrChurubusco[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          // hover: this.arrChurubusco[0]['problemas_isp'] ? '#ff0000' : this.arrChurubusco[0]['problemas_isp'] == '' ? '#6b6b6b' : '#08ff08',
          color: this.arrChurubusco[0]['problemas_isp'] ? this.arrChurubusco[0]['color_problemas_isp'] : '#08ff08',
          hover: this.arrChurubusco[0]['problemas_isp'] ? this.arrChurubusco[0]['color_problemas_isp'] : '#08ff08',
          highlight: this.arrChurubusco[0]['problemas_isp'] ? this.arrChurubusco[0]['color_problemas_isp'] : '#08ff08'
        },
        // label: this.arrChurubusco[0]['ancho_banda_total_isp'],
        title: this.htmlTitle(this.arrChurubusco[0]['interfaces_isp']),
        font: {
          color: '#ffffff',
          background: "#000000",
          align: 'bottom',
          size: 12,
          vadjust: 10,
          strokeWidth: 1
        },
        labelHighlightBold: false
      },
      // { // Arista a Peerings
      //   id: 19,
      //   from: 1,
      //   to: 19,
      //   color: {
      //     // color: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
      //     // hover: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
      //     color: this.arrArista[0]['problemas_peerings'] == 1 ? '#ff0000' : '#08ff08',
      //     hover: this.arrArista[0]['problemas_peerings'] == 1 ? '#ff0000' : '#08ff08'
      //   },
      //   label: this.arrArista[0]['ancho_banda_total'],
      //   title: '',
      //   font: {
      //     color: '#ffffff',
      //     background: "#000000",
      //     align: 'top',
      //     size: 12,
      //     vadjust: 30,
      //     strokeWidth: 1
      //   },
      //   labelHighlightBold: false
      // },
      // { // Kio Qro a Peerings
      //   id: 20,
      //   from: 4,
      //   to: 20,
      //   color: {
      //     // color: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
      //     // hover: this.arrChurubusco[0]['problemas_enlace_arista'] ? '#ff0000' : this.arrChurubusco[0]['problemas_enlace_arista'] == '' ? '#6b6b6b' : '#08ff08',
      //     color: this.arrKioQro[0]['problemas_peerings'] == 1 ? '#ff0000' : '#08ff08',
      //     hover: this.arrKioQro[0]['problemas_peerings'] == 1 ? '#ff0000' : '#08ff08'
      //   },
      //   label: this.arrKioQro[0]['ancho_banda_total'],
      //   title: '',
      //   font: {
      //     color: '#ffffff',
      //     background: "#000000",
      //     align: 'bottom',
      //     size: 12,
      //     vadjust: 5,
      //     strokeWidth: 1
      //   },
      //   labelHighlightBold: false
      // },

      // #3083CE Azul
      // #ff0000 Rojo
      // #08ff08 Verde
    ];
    console.log('Edges: ', edges);

    var treeData = {
      nodes: nodes,
      edges: edges
    };
    this.ref.detectChanges();
    return treeData;
  }

  htmlTitle(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container;
  }

  openModal(content) {

    this.modalService.open(content, {
      size: "xl",
      centered: true,
      scrollable: true,
      backdrop: "static",
      keyboard: false,
    });
  }


}
