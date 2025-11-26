import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Ubigeo } from '../modelos/Direccion.model';

@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
  // ⭐ USAR JSON LOCAL (cambiar a endpoint del backend cuando esté listo)
  private apiUrl = 'assets/data/ubigeos.json';

  // Cache de ubigeos
  private ubigeosCache: Ubigeo[] = [];
  private ubigeosLoaded = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.cargarUbigeos();
  }

  /**
   * Cargar todos los ubigeos desde JSON local
   */
  private cargarUbigeos(): void {
    console.log('🔄 Intentando cargar ubigeos desde:', this.apiUrl);

    this.http
      .get<Ubigeo[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('❌ Error al cargar ubigeos desde JSON local:', error);
          console.warn('⚠️ Usando datos de ejemplo limitados');
          return of(this.getUbigeosEjemplo());
        })
      )
      .subscribe((ubigeos) => {
        this.ubigeosCache = ubigeos;
        this.ubigeosLoaded.next(true);
        console.log(
          `✅ Ubigeos cargados exitosamente: ${ubigeos.length} registros`
        );

        // Mostrar estadísticas
        const departamentos = [...new Set(ubigeos.map((u) => u.departamento))];
        console.log(
          `📊 Estadísticas: ${departamentos.length} departamentos, ${ubigeos.length} ubigeos totales`
        );
      });
  }

  /**
   * Obtener todos los ubigeos
   */
  obtenerTodosLosUbigeos(): Observable<Ubigeo[]> {
    if (this.ubigeosCache.length > 0) {
      return of(this.ubigeosCache);
    }

    return this.http.get<Ubigeo[]>(this.apiUrl).pipe(
      tap((ubigeos) => {
        this.ubigeosCache = ubigeos;
        console.log(`✅ Ubigeos cargados: ${ubigeos.length} registros`);
      }),
      catchError((error) => {
        console.error('❌ Error al cargar ubigeos:', error);
        return of(this.getUbigeosEjemplo());
      })
    );
  }

  /**
   * Obtener lista de departamentos únicos
   */
  obtenerDepartamentos(): string[] {
    const departamentos = [
      ...new Set(this.ubigeosCache.map((u) => u.departamento)),
    ];
    const resultado = departamentos.sort();
    console.log(`📍 Departamentos disponibles: ${resultado.length}`, resultado);
    return resultado;
  }

  /**
   * Obtener provincias de un departamento
   */
  obtenerProvincias(departamento: string): string[] {
    const provincias = this.ubigeosCache
      .filter((u) => u.departamento === departamento)
      .map((u) => u.provincia);

    const resultado = [...new Set(provincias)].sort();
    console.log(
      `📍 Provincias de "${departamento}": ${resultado.length} encontradas`
    );
    return resultado;
  }

  /**
   * Obtener distritos de una provincia
   */
  obtenerDistritos(departamento: string, provincia: string): string[] {
    const distritos = this.ubigeosCache
      .filter(
        (u) => u.departamento === departamento && u.provincia === provincia
      )
      .map((u) => u.distrito);

    const resultado = [...new Set(distritos)].sort();
    console.log(
      `📍 Distritos de "${departamento} - ${provincia}": ${resultado.length} encontrados`,
      resultado
    );
    return resultado;
  }

  /**
   * Obtener código de ubigeo por departamento, provincia y distrito
   */
  obtenerCodigoUbigeo(
    departamento: string,
    provincia: string,
    distrito: string
  ): string | null {
    const ubigeo = this.ubigeosCache.find(
      (u) =>
        u.departamento === departamento &&
        u.provincia === provincia &&
        u.distrito === distrito
    );

    if (ubigeo) {
      console.log(
        `✅ Código encontrado: ${ubigeo.codigoUbigeo} para ${departamento}-${provincia}-${distrito}`
      );
    } else {
      console.error(
        `❌ No se encontró código para: ${departamento}-${provincia}-${distrito}`
      );
    }

    return ubigeo?.codigoUbigeo || null;
  }

  /**
   * Obtener información completa de ubigeo por código
   */
  obtenerUbigeoPorCodigo(codigo: string): Ubigeo | null {
    return this.ubigeosCache.find((u) => u.codigoUbigeo === codigo) || null;
  }

  /**
   * Datos de ejemplo (fallback si no se puede cargar el JSON)
   * Solo algunos registros para que la app no falle completamente
   */
  private getUbigeosEjemplo(): Ubigeo[] {
    console.warn(
      '⚠️ ATENCIÓN: Usando solo datos de ejemplo - La funcionalidad será MUY limitada'
    );
    console.warn(
      '⚠️ Para solucionar: Copia ubigeos.json a src/assets/data/ubigeos.json'
    );

    return [
      // Distritos harcodeados :v
      {
        codigoUbigeo: '010101',
        departamento: 'AMAZONAS',
        provincia: 'CHACHAPOYAS',
        distrito: 'CHACHAPOYAS',
      },
      {
        codigoUbigeo: '020101',
        departamento: 'ÁNCASH',
        provincia: 'HUARAZ',
        distrito: 'HUARAZ',
      },
      {
        codigoUbigeo: '030101',
        departamento: 'APURÍMAC',
        provincia: 'ABANCAY',
        distrito: 'ABANCAY',
      },
      {
        codigoUbigeo: '040101',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'AREQUIPA',
      },
      {
        codigoUbigeo: '040102',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'ALTO SELVA ALEGRE',
      },
      {
        codigoUbigeo: '040103',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'CAYMA',
      },
      {
        codigoUbigeo: '040104',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'CERRO COLORADO',
      },
      {
        codigoUbigeo: '040105',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'CHARACATO',
      },
      {
        codigoUbigeo: '040106',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'CHIGUATA',
      },
      {
        codigoUbigeo: '040107',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'JACOBO HUNTER',
      },
      {
        codigoUbigeo: '040108',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'LA JOYA',
      },
      {
        codigoUbigeo: '040109',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'MARIANO MELGAR',
      },
      {
        codigoUbigeo: '040110',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'MIRAFLORES',
      },
      {
        codigoUbigeo: '040111',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'MOLLEBAYA',
      },
      {
        codigoUbigeo: '040112',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'PAUCARPATA',
      },
      {
        codigoUbigeo: '040113',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'POCSI',
      },
      {
        codigoUbigeo: '040114',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'POLOBAYA',
      },
      {
        codigoUbigeo: '040115',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'QUEQUEÑA',
      },
      {
        codigoUbigeo: '040116',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SABANDÍA',
      },
      {
        codigoUbigeo: '040117',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SACHACA',
      },
      {
        codigoUbigeo: '040118',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SAN JUAN DE SIGUAS',
      },
      {
        codigoUbigeo: '040119',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SAN JUAN DE TARUCANI',
      },
      {
        codigoUbigeo: '040120',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SANTA ISABEL DE SIGUAS',
      },
      {
        codigoUbigeo: '040121',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SANTA RITA DE SIGUAS',
      },
      {
        codigoUbigeo: '040122',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'SOCABAYA',
      },
      {
        codigoUbigeo: '040123',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'TIABAYA',
      },
      {
        codigoUbigeo: '040124',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'UCHUMAYO',
      },
      {
        codigoUbigeo: '040125',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'VITOR',
      },
      {
        codigoUbigeo: '040126',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'YANAHUARA',
      },
      {
        codigoUbigeo: '040127',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'YARABAMBA',
      },
      {
        codigoUbigeo: '040128',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'YURA',
      },
      {
        codigoUbigeo: '040129',
        departamento: 'AREQUIPA',
        provincia: 'AREQUIPA',
        distrito: 'JOSÉ LUIS BUSTAMANTE Y RIVERO',
      },
      {
        codigoUbigeo: '050101',
        departamento: 'AYACUCHO',
        provincia: 'HUAMANGA',
        distrito: 'AYACUCHO',
      },
      {
        codigoUbigeo: '060101',
        departamento: 'CAJAMARCA',
        provincia: 'CAJAMARCA',
        distrito: 'CAJAMARCA',
      },
      {
        codigoUbigeo: '070101',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'CALLAO',
      },
      {
        codigoUbigeo: '070102',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'BELLAVISTA',
      },
      {
        codigoUbigeo: '070103',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'CARMEN DE LA LEGUA REYNOSO',
      },
      {
        codigoUbigeo: '070104',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'LA PERLA',
      },
      {
        codigoUbigeo: '070105',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'LA PUNTA',
      },
      {
        codigoUbigeo: '070106',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'VENTANILLA',
      },
      {
        codigoUbigeo: '070107',
        departamento: 'CALLAO',
        provincia: 'CALLAO',
        distrito: 'MI PERÚ',
      },
      {
        codigoUbigeo: '080101',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'CUSCO',
      },
      {
        codigoUbigeo: '080102',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'CCORCA',
      },
      {
        codigoUbigeo: '080103',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'POROY',
      },
      {
        codigoUbigeo: '080104',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'SAN JERÓNIMO',
      },
      {
        codigoUbigeo: '080105',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'SAN SEBASTIÁN',
      },
      {
        codigoUbigeo: '080106',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'SANTIAGO',
      },
      {
        codigoUbigeo: '080107',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'SAYLLA',
      },
      {
        codigoUbigeo: '080108',
        departamento: 'CUSCO',
        provincia: 'CUSCO',
        distrito: 'WANCHAQ',
      },
      {
        codigoUbigeo: '090101',
        departamento: 'HUANCAVELICA',
        provincia: 'HUANCAVELICA',
        distrito: 'HUANCAVELICA',
      },
      {
        codigoUbigeo: '100101',
        departamento: 'HUÁNUCO',
        provincia: 'HUÁNUCO',
        distrito: 'HUÁNUCO',
      },
      {
        codigoUbigeo: '110101',
        departamento: 'ICA',
        provincia: 'ICA',
        distrito: 'ICA',
      },
      {
        codigoUbigeo: '120101',
        departamento: 'JUNÍN',
        provincia: 'HUANCAYO',
        distrito: 'HUANCAYO',
      },
      {
        codigoUbigeo: '130101',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'TRUJILLO',
      },
      {
        codigoUbigeo: '130102',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'EL PORVENIR',
      },
      {
        codigoUbigeo: '130103',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'FLORENCIA DE MORA',
      },
      {
        codigoUbigeo: '130104',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'HUANCHACO',
      },
      {
        codigoUbigeo: '130105',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'LA ESPERANZA',
      },
      {
        codigoUbigeo: '130106',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'LAREDO',
      },
      {
        codigoUbigeo: '130107',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'MOCHE',
      },
      {
        codigoUbigeo: '130108',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'POROTO',
      },
      {
        codigoUbigeo: '130109',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'SALAVERRY',
      },
      {
        codigoUbigeo: '130110',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'SIMBAL',
      },
      {
        codigoUbigeo: '130111',
        departamento: 'LA LIBERTAD',
        provincia: 'TRUJILLO',
        distrito: 'VICTOR LARCO HERRERA',
      },
      {
        codigoUbigeo: '140101',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'CHICLAYO',
      },
      {
        codigoUbigeo: '140102',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'CHONGOYAPE',
      },
      {
        codigoUbigeo: '140103',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'ETEN',
      },
      {
        codigoUbigeo: '140104',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'ETEN PUERTO',
      },
      {
        codigoUbigeo: '140105',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'JOSÉ LEONARDO ORTIZ',
      },
      {
        codigoUbigeo: '140106',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'LA VICTORIA',
      },
      {
        codigoUbigeo: '140107',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'LAGUNAS',
      },
      {
        codigoUbigeo: '140108',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'MONSEFU',
      },
      {
        codigoUbigeo: '140109',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'NUEVA ARICA',
      },
      {
        codigoUbigeo: '140110',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'OYOTUN',
      },
      {
        codigoUbigeo: '140111',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'PICSI',
      },
      {
        codigoUbigeo: '140112',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'PIMENTEL',
      },
      {
        codigoUbigeo: '140113',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'REQUE',
      },
      {
        codigoUbigeo: '140114',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'SANTA ROSA',
      },
      {
        codigoUbigeo: '140115',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'SAÑA',
      },
      {
        codigoUbigeo: '140116',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'CAYALTI',
      },
      {
        codigoUbigeo: '140117',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'PATAPO',
      },
      {
        codigoUbigeo: '140118',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'POMALCA',
      },
      {
        codigoUbigeo: '140119',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'PUCALA',
      },
      {
        codigoUbigeo: '140120',
        departamento: 'LAMBAYEQUE',
        provincia: 'CHICLAYO',
        distrito: 'TUMAN',
      },
      {
        codigoUbigeo: '150101',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LIMA',
      },
      {
        codigoUbigeo: '150102',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'ANCÓN',
      },
      {
        codigoUbigeo: '150103',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'ATE',
      },
      {
        codigoUbigeo: '150104',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'BARRANCO',
      },
      {
        codigoUbigeo: '150105',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'BREÑA',
      },
      {
        codigoUbigeo: '150106',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'CARABAYLLO',
      },
      {
        codigoUbigeo: '150107',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'CHACLACAYO',
      },
      {
        codigoUbigeo: '150108',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'CHORRILLOS',
      },
      {
        codigoUbigeo: '150109',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'CIENEGUILLA',
      },
      {
        codigoUbigeo: '150110',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'COMAS',
      },
      {
        codigoUbigeo: '150111',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'EL AGUSTINO',
      },
      {
        codigoUbigeo: '150112',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'INDEPENDENCIA',
      },
      {
        codigoUbigeo: '150113',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'JESÚS MARÍA',
      },
      {
        codigoUbigeo: '150114',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LA MOLINA',
      },
      {
        codigoUbigeo: '150115',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LA VICTORIA',
      },
      {
        codigoUbigeo: '150116',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LINCE',
      },
      {
        codigoUbigeo: '150117',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LOS OLIVOS',
      },
      {
        codigoUbigeo: '150118',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LURIGANCHO',
      },
      {
        codigoUbigeo: '150119',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'LURIN',
      },
      {
        codigoUbigeo: '150120',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'MAGDALENA DEL MAR',
      },
      {
        codigoUbigeo: '150121',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PUEBLO LIBRE',
      },
      {
        codigoUbigeo: '150122',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'MIRAFLORES',
      },
      {
        codigoUbigeo: '150123',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PACHACAMAC',
      },
      {
        codigoUbigeo: '150124',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PUCUSANA',
      },
      {
        codigoUbigeo: '150125',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PUENTE PIEDRA',
      },
      {
        codigoUbigeo: '150126',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PUNTA HERMOSA',
      },
      {
        codigoUbigeo: '150127',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'PUNTA NEGRA',
      },
      {
        codigoUbigeo: '150128',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'RÍMAC',
      },
      {
        codigoUbigeo: '150129',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN BARTOLO',
      },
      {
        codigoUbigeo: '150130',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN BORJA',
      },
      {
        codigoUbigeo: '150131',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN ISIDRO',
      },
      {
        codigoUbigeo: '150132',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN JUAN DE LURIGANCHO',
      },
      {
        codigoUbigeo: '150133',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN JUAN DE MIRAFLORES',
      },
      {
        codigoUbigeo: '150134',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN LUIS',
      },
      {
        codigoUbigeo: '150135',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN MARTÍN DE PORRES',
      },
      {
        codigoUbigeo: '150136',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SAN MIGUEL',
      },
      {
        codigoUbigeo: '150137',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SANTA ANITA',
      },
      {
        codigoUbigeo: '150138',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SANTA MARÍA DEL MAR',
      },
      {
        codigoUbigeo: '150139',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SANTA ROSA',
      },
      {
        codigoUbigeo: '150140',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SANTIAGO DE SURCO',
      },
      {
        codigoUbigeo: '150141',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'SURQUILLO',
      },
      {
        codigoUbigeo: '150142',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'VILLA EL SALVADOR',
      },
      {
        codigoUbigeo: '150143',
        departamento: 'LIMA',
        provincia: 'LIMA',
        distrito: 'VILLA MARÍA DEL TRIUNFO',
      },
      {
        codigoUbigeo: '160101',
        departamento: 'LORETO',
        provincia: 'MAYNAS',
        distrito: 'IQUITOS',
      },
      {
        codigoUbigeo: '170101',
        departamento: 'MADRE DE DIOS',
        provincia: 'TAMBOPATA',
        distrito: 'TAMBOPATA',
      },
      {
        codigoUbigeo: '180101',
        departamento: 'MOQUEGUA',
        provincia: 'MARISCAL NIETO',
        distrito: 'MOQUEGUA',
      },
      {
        codigoUbigeo: '190101',
        departamento: 'PASCO',
        provincia: 'PASCO',
        distrito: 'CHAUPIMARCA',
      },
      {
        codigoUbigeo: '200101',
        departamento: 'PIURA',
        provincia: 'PIURA',
        distrito: 'PIURA',
      },
      {
        codigoUbigeo: '210101',
        departamento: 'PUNO',
        provincia: 'PUNO',
        distrito: 'PUNO',
      },
      {
        codigoUbigeo: '220101',
        departamento: 'SAN MARTÍN',
        provincia: 'MOYOBAMBA',
        distrito: 'MOYOBAMBA',
      },
      {
        codigoUbigeo: '230101',
        departamento: 'TACNA',
        provincia: 'TACNA',
        distrito: 'TACNA',
      },
      {
        codigoUbigeo: '240101',
        departamento: 'TUMBES',
        provincia: 'TUMBES',
        distrito: 'TUMBES',
      },
      {
        codigoUbigeo: '250101',
        departamento: 'UCAYALI',
        provincia: 'CORONEL PORTILLO',
        distrito: 'CALLERÍA',
      },
    ];
  }

  /**
   * Observable para saber cuándo los ubigeos están cargados
   */
  get ubigeosListos$(): Observable<boolean> {
    return this.ubigeosLoaded.asObservable();
  }
}
