import React, { useReducer, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { AGREGAR_BENEFICIO_A_FAVORITOS, AGREGAR_BENEFICIO_A_FAVORITOS_ERROR, AGREGAR_SUCURSAL_A_FAVORITOS, AGREGAR_SUCURSAL_A_FAVORITOS_ERROR, CREAR_CUPON, CREAR_CUPON_ERROR, ELIMINAR_BENEFICIO_A_FAVORITOS, ELIMINAR_BENEFICIO_A_FAVORITOS_ERROR, ELIMINAR_SUCURSAL_A_FAVORITOS, ELIMINAR_SUCURSAL_A_FAVORITOS_ERROR, MENSAJE_ERROR, OBTENER_BENEFICIO, OBTENER_BENEFICIOS, OBTENER_BENEFICIOS_CATEGORIA, OBTENER_BENEFICIOS_CATEGORIA_ERROR, OBTENER_BENEFICIOS_ERROR, OBTENER_BENEFICIOS_EXCLUSIVOS, OBTENER_BENEFICIOS_EXCLUSIVOS_ERROR, OBTENER_BENEFICIOS_EXCLUSIVOS_GEO, OBTENER_BENEFICIOS_EXCLUSIVOS_GEO_ERROR, OBTENER_BENEFICIOS_FAVORITOS, OBTENER_BENEFICIOS_FAVORITOS_ERROR, OBTENER_BENEFICIO_ERROR, OBTENER_CUPONES, OBTENER_CUPONES_ERROR, RESETEAR_CARGANDO, RESETEAR_CREADO, RESETEAR_MENSAJE, BENEFICIOS_BUSCADOS } from "../../types";
import beneficiosReducer from "./beneficiosReducer";
import beneficiosContext from "./beneficiosContext";
import $ from 'jquery';

const BeneficiosState = props => {
    const initialState = {
        beneficio: null,
        beneficiosPorCategoria: [],
        beneficios: [],
        beneficiosExclusivos: [],
        mensajeBeneficios: null,
        esFavorito: false,
        cupon: null,
        cupones: null,
        cargandoBeneficios: true,
        creado: false,
        beneficiosBuscados:[],
        beneficiosMarcas:[],
        beneficiosDescuentos:[],
        beneficiosCategorias:[]
    }

    useEffect(() => {

        clienteAxios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalConfig = error.config;
                if (error.response) {
                    if (error.response.status === 401) {
                        window.location.replace("/");
                    }
                }
                return Promise.reject(error);
            }
        );
    }, [])

    const [state, dispatch] = useReducer(beneficiosReducer, initialState);

    const obtenerBeneficios = async () => {

        try {
            const obj = [{
                id: 0,
                name: 'todos',
                label: 'Todos',
                value: ''
            }]

            const respuesta = await clienteAxios.get('getbeneficios');

            respuesta.data.forEach((element, index) => {
                if (element.categoria !== null && element.categoria !== ''){
                    obj.push({
                        id: index + 1,
                        name: element.categoria,
                        label: element.categoria,
                        value: element.categoria,
                        ordenFiltro: element.ordenFiltro
                    });
                }
            })

            obj.sort((a, b) => a.ordenFiltro - b.ordenFiltro);

            for (let i = 0; i < obj.length; i++) {
                if (obj[i].id !== 0) {
                    obj[i].id = i;
                }
            }

            dispatch({
                type: OBTENER_BENEFICIOS,
                payload: respuesta.data,
                categorias: obj,
            })

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al obtener los beneficios.',
                categoria: 'error',
            }
            dispatch({
                type: OBTENER_BENEFICIOS_ERROR,
                payload: alerta,
            })

        }
    }

    const obtenerBeneficiosPorCategoria = async (tipo, lat, lng) => {
        try {

            resetearCargando();

            const respuesta = await clienteAxios.get('getbeneficiosbytipo/' + tipo + '/' + lat + '/' + lng);
            dispatch({
                type: OBTENER_BENEFICIOS_CATEGORIA,
                payload: respuesta.data.response,
            })

        } catch (err) {
            enviarError(err);
        }
    }

    const obtenerBeneficio = async (id, lat, lng) => {

        try {

            resetearCargando();
            const respuesta = await clienteAxios.get('getbeneficiosbyid/' + id + "/" + lat + "/" + lng);
            dispatch({
                type: OBTENER_BENEFICIO,
                payload: respuesta.data
            })

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al obtener el beneficio específico.',
                categoria: 'error',
            }
            dispatch({
                type: OBTENER_BENEFICIO_ERROR,
                payload: alerta,
            })

        }
    }

    const obtenerBeneficiosFavoritos = async (lat, lng) => {
        try {
            resetearCargando();
            
            const respuesta = await clienteAxios.get('getbeneficiosfavoritos/' + lat + '/' + lng);
            dispatch({
                type: OBTENER_BENEFICIOS_FAVORITOS,
                payload: respuesta.data.response
            })

        } catch (err) {
            enviarError(err);
        }
    }

    const obtenerBeneficiosExclusivos = async () => {
        try {
            resetearCreado();
            const respuesta = await clienteAxios.get('getbeneficiosexclusivos');
            dispatch({
                type: OBTENER_BENEFICIOS_EXCLUSIVOS,
                payload: respuesta.data.response
            })

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al obtener los beneficios exclusivos.',
                categoria: 'error',
            }
            dispatch({
                type: OBTENER_BENEFICIOS_EXCLUSIVOS_ERROR,
                payload: alerta,
            })

        }
    }

    const obtenerBeneficiosExclusivosConGeo = async (lat, lng) => {
        try {
            resetearCargando();

            const respuesta = await clienteAxios.get('getbeneficiosexclusivosgeo/' + lat + '/' + lng);

            dispatch({
                type: OBTENER_BENEFICIOS_EXCLUSIVOS_GEO,
                payload: respuesta.data.response
            })

        } catch (err) {
            enviarError(err);
        }
    }

    const obtenerCupones = async () => {
        try {
            const respuesta = await clienteAxios.get('getcupones');
            if (respuesta.headers["content-type"].indexOf('html') !== -1) {
                throw "";
            }

            dispatch({
                type: OBTENER_CUPONES,
                payload: respuesta.data
            })

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al obtener los cupones.',
                categoria: 'error',
            }
            dispatch({
                type: OBTENER_CUPONES_ERROR,
                payload: alerta,
            })

        }
    }

    const canjearCupon = async (id) => {
        try {

            resetearCargando();

            var respuesta = await clienteAxios.get('createcuponbeneficio/' + id);
            
            dispatch({
                type: CREAR_CUPON,
                payload: respuesta.data?.response
            })

        } catch (err) {
            const error = err.response;
            const alerta = {
                msg: error !== undefined ? error.data.message : "Hay un error en el servidor, intentá más tarde por favor",
                categoria: error !== undefined ? error.data.type : "error",
            }
            dispatch({
                type: CREAR_CUPON_ERROR,
                payload: alerta,
            })
        }
    }

    const agregarBeneficioAFavoritos = async (id) => {
        try {

            dispatch({
                type: AGREGAR_BENEFICIO_A_FAVORITOS,
                payload: true,
            })

            const respuesta = await clienteAxios.get('addbeneficiofavorito/' + id);

            if (respuesta.headers["content-type"].indexOf('html') !== -1) {
                throw "";
            }

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al agregar el beneficio a favoritos.',
                categoria: 'error',
            }
            dispatch({
                type: AGREGAR_BENEFICIO_A_FAVORITOS_ERROR,
                payload: alerta,
            })

        }
    }

    const eliminarBeneficioAFavoritos = async (id) => {
        try {

            dispatch({
                type: ELIMINAR_BENEFICIO_A_FAVORITOS,
                payload: false,
            })

            const respuesta = await clienteAxios.delete('deletebeneficiofavorito/' + id);

            if (respuesta.headers["content-type"].indexOf('html') !== -1) {
                throw "";
            }


        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al eliminar el beneficio a favoritos.',
                categoria: 'error',
            }
            dispatch({
                type: ELIMINAR_BENEFICIO_A_FAVORITOS_ERROR,
                payload: alerta,
            })

        }
    }

    const agregarSucursalAFavoritos = async (id) => {
        try {
            
            dispatch({
                type: AGREGAR_SUCURSAL_A_FAVORITOS,
                payload: {
                    esFavorito: true,
                    id: id
                },
            })
            
            const respuesta = await clienteAxios.get('addbeneficiofavorito/' + id);
            if (respuesta.headers["content-type"].indexOf('html') !== -1) {
                throw "";
            }

        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al agregar el beneficio a favoritos.',
                categoria: 'error',
            }
            dispatch({
                type: AGREGAR_SUCURSAL_A_FAVORITOS_ERROR,
                payload: alerta,
            })

        }
    }

    const eliminarSucursalAFavoritos = async (id) => {
        try {

            dispatch({
                type: ELIMINAR_SUCURSAL_A_FAVORITOS,
                payload: {
                    esFavorito: false,
                    id: id
                },
            })

            const respuesta = await clienteAxios.delete('deletebeneficiofavorito/' + id);

            if (respuesta.headers["content-type"].indexOf('html') !== -1) {
                throw "";
            }


        } catch (error) {
            const alerta = {
                msg: 'Ha ocurrido un error al eliminar el beneficio a favoritos.',
                categoria: 'error',
            }
            dispatch({
                type: ELIMINAR_SUCURSAL_A_FAVORITOS_ERROR,
                payload: alerta,
            })

        }
    }
    const buscarBeneficioPorNombre = async (nombreBeneficio,lat,lon) => {
        resetearCargando();
        await clienteAxios.get(`getbeneficiopornombre/${nombreBeneficio}/${lat}/${lon}`)
        .then(r=>{
            dispatch({
                type: BENEFICIOS_BUSCADOS,
                payload: r.data?.response,
            })
        })
        .catch(e=>{
            enviarError(e);
        })
        
    }

    const buscarBeneficiosFiltrados = async (datos,lat,lon)=>{
        datos.masCercanos.lat=lat;
        datos.masCercanos.lon=lon;
        resetearCargando();
        await clienteAxios.post('getbeneficiosfiltrados/',datos)
        .then(r=>{
            if(window.location.pathname == "/beneficios/busqueda"){
                dispatch({
                    type: BENEFICIOS_BUSCADOS,
                    payload: r.data?.response,
                })
            }
            else{
                dispatch({
                    type: OBTENER_BENEFICIOS_CATEGORIA,
                    payload: r.data?.response,
                })
            }
        })
        .catch(e=>{
            enviarError(e);
        })
    }

    const resetearCargando = () => {
        dispatch({
            type: RESETEAR_CARGANDO,
        })
    }

    const resetearMensajeBeneficios = () => {
        dispatch({
            type: RESETEAR_MENSAJE,
        })
    }

    const resetearCreado = () => {
        dispatch({
            type: RESETEAR_CREADO,
        })
    }

    const enviarError = (err) => {
        const error = err.response;
        const alerta = {
            msg: error !== undefined ? error.data.message : "Este servicio no está disponible, por favor inténtelo de nuevo más tarde",
            categoria: error !== undefined ? error.data.type : "error",
        }
        dispatch({
            type: MENSAJE_ERROR,
            payload: alerta,
        })
    }

    return (
        <beneficiosContext.Provider
            value={{
                programa: state.programa,
                categorias: state.categorias,
                beneficios: state.beneficios,
                beneficio: state.beneficio,
                sucursales: state.sucursales,
                cupon: state.cupon,
                cupones: state.cupones,
                beneficiosPorCategoria: state.beneficiosPorCategoria,
                beneficiosExclusivos: state.beneficiosExclusivos,
                mensajeBeneficios: state.mensajeBeneficios,
                creado: state.creado,
                cargandoBeneficios: state.cargandoBeneficios,
                redirect: state.redirect,
                esFavorito: state.esFavorito,
                beneficiosBuscados: state.beneficiosBuscados,
                beneficiosMarcas:state.beneficiosMarcas,
                beneficiosDescuentos:state.beneficiosDescuentos,
                beneficiosCategorias:state.beneficiosCategorias,
                obtenerBeneficio,
                obtenerBeneficios,
                agregarBeneficioAFavoritos,
                eliminarBeneficioAFavoritos,
                agregarSucursalAFavoritos,
                eliminarSucursalAFavoritos,
                canjearCupon,
                obtenerCupones,
                obtenerBeneficiosPorCategoria,
                obtenerBeneficiosExclusivos,
                obtenerBeneficiosExclusivosConGeo,
                obtenerBeneficiosFavoritos,
                resetearCreado,
                resetearMensajeBeneficios,
                resetearCargando,
                buscarBeneficioPorNombre,
                buscarBeneficiosFiltrados
            }}>
            {props.children}
        </beneficiosContext.Provider>
    )
}

export default BeneficiosState;