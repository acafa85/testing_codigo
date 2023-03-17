import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import beneficiosContext from '../../context/beneficios/beneficiosContext';
import Background from '../layout/Background';
import Cargando from '../layout/Cargando';
import Footer from '../layout/Footer';
import Onboarding from '../layout/Onboarding';
import Header from '../layout/Header';
import BeneficiosFiltros from './BeneficiosFiltros';
import $ from 'jquery';
import { LazyImage, LazyComponent } from 'lazy-react'

const BeneficiosBusqueda = () => {
    var bandera=true;
    const { cargandoBeneficios, buscarBeneficioPorNombre, beneficiosBuscados, beneficiosMarcas, beneficiosDescuentos, beneficiosCategorias, beneficioBuscar, agregarSucursalAFavoritos, eliminarSucursalAFavoritos} = useContext(beneficiosContext);

    const navigate = useNavigate();
    let isMounted = useRef(true);

    const location=useLocation();
    const [disabled, setDisabled] = useState([]);
    const [valoresFiltros, setValoresFiltros] = useState({
        verTodos:false,
        verTodosVer:true,
        masCercanos:false,
        masCercanosVer:true,
        porMarca:false,
        porMarcaVer:true,
        porCategoria:false,
        porCategoriaVer:true,
        porDescuento:false,
        porDescuentoVer:true
    });

    const [expandirFiltros, setExpandirFiltros] = useState({
        filtroMarca:false,
        filtroCategoria:false,
        filtroDescuento:false,
    });

    const [mostrarSinResultados, setMostrarSinResultados] = useState();
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [buscar, setBuscar] = useState("");
    const setBeneficio = beneficio => {
        setBuscar(beneficio);
        //setMostrar(false);
    }
    const [checkboxLists,setCheckboxLists] = useState({
        beneficiosMarcas: [],
        beneficiosCategorias: [],
        beneficiosDescuentos: []
    });

    let userLocation;
    const ref = useRef(true);
    useEffect(() => {
        const firstRender = ref.current;
        
        if(beneficiosBuscados.length>0) setMostrarSinResultados(false);

        if(buscar==="" && checkboxLists.beneficiosMarcas.length===0) setBuscar(location.state.beneficioBuscar);
        setMostrarFiltros(false);
        
        if(checkboxLists?.beneficiosMarcas.length>0 && !firstRender ){
            // var checkeado = {checked:false};

            // beneficiosMarcas.forEach((elem,index)=>{
            //     if(checkboxLists.beneficiosMarcas[index].checked) checkeado.checked=true;
            //     else checkeado.checked=false;
            //     $.extend(elem,checkeado);
            // });
            // beneficiosDescuentos.forEach((elem,index)=>{
            //     if(checkboxLists.beneficiosDescuentos[index].checked) checkeado.checked=true;
            //     else checkeado.checked=false;
            //     $.extend(elem,checkeado);
            // });
            // beneficiosCategorias.forEach((elem,index)=>{
            //     if(checkboxLists.beneficiosCategorias[index].checked) checkeado.checked=true;
            //     else checkeado.checked=false;
            //     $.extend(elem,checkeado);
            // });
            // setCheckboxLists({
            //     ...checkboxLists,
            //     beneficiosMarcas: beneficiosMarcas,
            //     beneficiosCategorias: beneficiosCategorias,
            //     beneficiosDescuentos: beneficiosDescuentos
            // });
        }
        else{
            ref.current = false;
            setCheckboxLists({
                ...checkboxLists,
                beneficiosMarcas: beneficiosMarcas,
                beneficiosCategorias: beneficiosCategorias,
                beneficiosDescuentos: beneficiosDescuentos
            });
            var checkeado = {checked:false};
            checkboxLists.beneficiosMarcas.forEach((elem,index)=>{
                $.extend(elem,checkeado);
            });
            checkboxLists.beneficiosDescuentos.forEach((elem,index)=>{
                $.extend(elem,checkeado);
            });
            checkboxLists.beneficiosCategorias.forEach((elem,index)=>{
                $.extend(elem,checkeado);
            });
        }

        /* Activo el boton del filtor mas cercanos si es que la localizacion esta activada, si la localizacion esta desactivada lo desactivo*/

        if (isMounted.current) {
            navigator.geolocation.getCurrentPosition(position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                buscarBeneficioPorNombre(location.state.beneficioBuscar, userLocation.lat, userLocation.lng);
                setValoresFiltros({
                    ...valoresFiltros,
                    verTodos:true,
                    masCercanos:true
                });
            }, function (e) {
                userLocation = {
                    lat: 0,
                    lng: 0
                }
                buscarBeneficioPorNombre(location.state.beneficioBuscar, userLocation.lat,userLocation.lng);
                setValoresFiltros({
                    ...valoresFiltros,
                    verTodos:true,
                    masCercanos:false
                });
            }, {
                enableHighAccuracy: true
            })
        }
        if (beneficiosBuscados?.length > 0) {
            const aux = new Array();
            for (let beneficio in beneficiosBuscados) {
                aux.push(false);
            }
            setDisabled(aux);
        }

        return () => {
            isMounted.current = false;
        }
    },[beneficiosBuscados]);


    /* cambiar favoritos */ 
    const handleFavorito = (index) => {
        const beneficio = beneficiosBuscados[index];

        setDisabled(beneficiosBuscados.map((beneficioAux, i) =>
            beneficioAux.idBeneficio === beneficio.idBeneficio ?
                true
                :
                disabled[i]
        ))

        setTimeout(() => {
            if (!beneficio.esFavorito) {
                agregarSucursalAFavoritos(beneficio.idBeneficio)
                setDisabled(beneficiosBuscados.map((beneficioAux, i) =>
                    beneficioAux.idBeneficio === beneficio.idBeneficio ?
                    beneficiosBuscados[i].esFavorito = true
                    :
                    disabled[i]
                ))
            } else {
                eliminarSucursalAFavoritos(beneficio.idBeneficio)
                setDisabled(beneficiosBuscados.map((beneficioAux, i) =>
                    beneficioAux.idBeneficio === beneficio.idBeneficio ?
                    beneficiosBuscados[i].esFavorito = false
                    :
                    disabled[i]
                ))
            }
        }, 1000)

    }

    /* buscar beneficio */ 
    const beneficioChange = event =>{
        setBuscar(event.target.value);
    }

    const buscarBeneficio = () =>{
        if(buscar.trim() !== ''){
            navigator.geolocation.getCurrentPosition(position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                buscarBeneficioPorNombre(buscar, userLocation.lat, userLocation.lng);
                setValoresFiltros({
                    ...valoresFiltros,
                    masCercanos:true
                });
            }, function (e) {
                userLocation = {
                    lat: 0,
                    lng: 0
                }
                buscarBeneficioPorNombre(buscar, userLocation.lat,userLocation.lng);
                setValoresFiltros({
                    ...valoresFiltros,
                    masCercanos:false
                });
            }, {
                enableHighAccuracy: true
            })
        }
        else{
            setMostrarSinResultados(true);
        }
    }

    /* menu de filtros*/ 
    $('#navbar_button').click((e)=>{
        setMostrarFiltros(true);
        show_up_filters();
    })

    function show_up_filters() {
        darken_screen2(true);
        document.getElementById('navbar_filters').classList.remove('hide-menu-filters');
        document.getElementById('navbar_filters').classList.add('show-menu-filters');
    }
    
    function darken_screen2(yesno) {
        if (yesno === true) {
            document.querySelector('.screen-darken').classList.add('active');
        } else if (yesno === false) {
            document.querySelector('.screen-darken').classList.remove('active');
        }
    }

    const disable_filters=(nombreFiltro)=>{
        switch(nombreFiltro){
            case "Ver todos":
                setValoresFiltros({
                    ...valoresFiltros,
                    verTodos:!valoresFiltros.verTodos
                });    
                break;
            case "Mas cercanos":
                setValoresFiltros({
                    ...valoresFiltros,
                    masCercanos:!valoresFiltros.masCercanos
                });
                break;
            case "Por marca":                    
                if(activarVerTodos("marca")){
                    setValoresFiltros({
                        ...valoresFiltros,
                        verTodos:true,
                        porMarca:!valoresFiltros.porMarca
                    });
                }
                else{
                    setValoresFiltros({
                        ...valoresFiltros,
                        porMarca:!valoresFiltros.porMarca
                    });
                }
                break;
            case "Por categoria":
                if(activarVerTodos("categoria")){
                    setValoresFiltros({
                        ...valoresFiltros,
                        verTodos:true,
                        porCategoria:!valoresFiltros.porCategoria
                    });
                }
                else{
                    setValoresFiltros({
                        ...valoresFiltros,
                        porCategoria:!valoresFiltros.porCategoria
                    });
                }
                break;
            case "Por descuento":
                if(activarVerTodos("descuento")){
                    setValoresFiltros({
                        ...valoresFiltros,
                        verTodos:true,
                        porDescuento:!valoresFiltros.porDescuento
                    }); 
                }
                else{
                    setValoresFiltros({
                        ...valoresFiltros,
                        porDescuento:!valoresFiltros.porDescuento
                    }); 
                }
                break;
        }
    }

    const activarVerTodos=(nombreFiltro)=>{
        var checkeado = {checked:false};
        switch(nombreFiltro){
            case "marca":
                beneficiosMarcas.forEach((elem,index)=>{
                    $.extend(elem,checkeado);
                });
                beneficiosDescuentos.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosDescuentos[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                beneficiosCategorias.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosCategorias[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                break;
            case "categoria":
                beneficiosCategorias.forEach((elem,index)=>{
                    $.extend(elem,checkeado);
                });
                beneficiosMarcas.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosMarcas[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                beneficiosDescuentos.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosDescuentos[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                break;
            case "descuento":
                beneficiosDescuentos.forEach((elem,index)=>{
                    $.extend(elem,checkeado);
                });
                beneficiosCategorias.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosCategorias[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                beneficiosMarcas.forEach((elem,index)=>{
                    if(checkboxLists.beneficiosMarcas[index].checked==true) checkeado.checked=true;
                    else checkeado.checked=false;
                    $.extend(elem,checkeado);
                });
                break;
        }
        setCheckboxLists({
            ...checkboxLists,
            beneficiosMarcas:beneficiosMarcas,
            beneficiosCategorias:beneficiosCategorias,
            beneficiosDescuentos:beneficiosDescuentos
        });
        var activarVerTodos=true;
        beneficiosMarcas.map((elem,index)=>{
            if(elem.checked==true) activarVerTodos=false;
        })
        beneficiosCategorias.map((elem,index)=>{
            if(elem.checked==true) activarVerTodos=false;
        })
        beneficiosDescuentos.map((elem,index)=>{
            if(elem.checked==true) activarVerTodos=false;
        })
        return activarVerTodos;
    }



    if (cargandoBeneficios) {
        return <Cargando />
    }

    return (
        <Fragment>
            <AuthenticatedTemplate>
                <div className="d-flex flex-column min-vh-100 w-100">
                    <Header />
                    
                    
                    <div className="d-flex flex-column flex-fill bg-header">
                        <div className="d-flex flex-row justify-content-between align-items-center p-3 text-gris">
                            <button onClick={() => navigate(-1)} className="btn-none d-flex flex-row align-items-center text-decoration-none">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289C12.0976 3.68342 12.0976 4.31658 11.7071 4.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L11.7071 19.2929C12.0976 19.6834 12.0976 20.3166 11.7071 20.7071C11.3166 21.0976 10.6834 21.0976 10.2929 20.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L10.2929 3.29289Z" fill="#0C1561" />
                                </svg>
                                {location.state &&
                                    <span className="ms-2 fs-16-400 text-azul">Resultado de búsqueda</span>
                                }
                            </button>

                            {/* <button id="navbar_button" data-triggerr="main" className='btn bt-none'> */}
                            <button type="button" className='btn bt-none' onClick={()=>{setMostrarFiltros(true);}} >  
                                { valoresFiltros.masCercanos || valoresFiltros.porMarca || valoresFiltros.porCategoria || valoresFiltros.porDescuento ?
                                    <img className="" src={`${window.location.origin}/img/pantalla-beneficios/filtros-beneficio-rosa.svg`} width="18px" height="18px"/>
                                    :
                                    <img className="" src={`${window.location.origin}/img/pantalla-beneficios/filtros-beneficio.svg`} width="18px" height="18px"/>
                                }
                            </button> 
                        </div>

                        { mostrarFiltros &&
                            <BeneficiosFiltros setMostrarFiltros={setMostrarFiltros} setValoresFiltros={setValoresFiltros} valoresFiltros={valoresFiltros} mostrarFiltros={mostrarFiltros} expandirFiltros={expandirFiltros} setExpandirFiltros={setExpandirFiltros} checkboxLists={checkboxLists} setCheckboxLists={setCheckboxLists} buscar={buscar} setBuscar={setBuscar} activarVerTodos={activarVerTodos} />
                        }

                        <div className='px-3 pb-3'>
                             {valoresFiltros?.masCercanos &&
                                <button className='btn btn-none rounded-pill boton-filtros-beneficios py-1 px-2 m-1 fs-12-400'>Mas cercanos
                                    <img className="ps-1" src={`${window.location.origin}/img/pantalla-beneficios/x-filtros.svg`} onClick={()=>disable_filters("Mas cercanos")} />
                                </button>
                             }
                             { valoresFiltros?.porMarca &&
                                <button className='btn btn-none rounded-pill boton-filtros-beneficios py-1 px-2 m-1 fs-12-400'>Por marca
                                    <img className="ps-1" src={`${window.location.origin}/img/pantalla-beneficios/x-filtros.svg`} onClick={()=>disable_filters("Por marca")} />                            
                                </button>
                             }
                             { valoresFiltros?.porCategoria &&
                                <button className='btn btn-none rounded-pill boton-filtros-beneficios py-1 px-2 m-1 fs-12-400'>Por categoria
                                    <img className="ps-1" src={`${window.location.origin}/img/pantalla-beneficios/x-filtros.svg`} onClick={()=>disable_filters("Por categoria")} />
                                </button>
                             }
                             { valoresFiltros?.porDescuento &&
                                <button className='btn btn-none rounded-pill boton-filtros-beneficios py-1 px-2 m-1 fs-12-400'>Por descuento
                                    <img className="ps-1" src={`${window.location.origin}/img/pantalla-beneficios/x-filtros.svg`} onClick={()=>disable_filters("Por descuento")} />                            
                                </button>
                             }
                        </div>
                        
                        <div className='mx-3 my-1 flex-container flex-column pos-rel position-relative'>
                            <input type="text" id="categoria_name" className="form-control form-control-lg shadow"
                                // onClick={ buscarBeneficioPorNombre(buscar)}
                                value={buscar}
                                onChange={event => beneficioChange(event)}
                                placeholder="Buscar Beneficio"
                                style={{height:'47px',borderRadius:'8px'}}
                            />
                            <img className="position-absolute" src={`${window.location.origin}/img/lupa-buscar-2.svg`} onClick={()=>buscarBeneficio()} style={{right:'20px',top:'12px'}} />                        
                        </div>

                        {beneficiosBuscados && beneficiosBuscados?.length > 0 && Array.isArray(beneficiosBuscados) && !mostrarSinResultados ?  
                            <div className="d-flex flex-column p-3">
                                {beneficiosBuscados.map((beneficio, index) => (
                                    <LazyComponent key={index}>
                                        <div className="btn-white text-decoration-none mb-2 d-flex flex-row align-items-center justify-content-between w-100">
                                            <Link to={"./" + beneficio.idBeneficio} className="text-decoration-none p-3 d-flex flex-row flex-fill align-items-center">
                                                <img className="img-circle" src={beneficio.logo} alt="" />
                                                {beneficio.monedas > 0 &&
                                                    <div className="ms-3 text-start w-100">
                                                        <p className="fs-16-bold mb-3">{beneficio.titulo1}</p>
                                                        <div className='d-flex justify-content-start align-items-center flex-row' >
                                                            <div className='px-2  me-2 bg-azul rounded d-flex justify-content-start align-items-center flex-row'>
                                                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M5.38012 4.39281C5.54664 4.56005 5.74741 4.75928 5.97062 4.97962L6.52333 4.4333C6.52333 4.4333 7.82451 3.19073 9.50362 3.18927C10.3129 3.18927 10.7667 3.18927 11.0212 3.18927C10.479 2.35495 9.73496 1.66904 8.8571 1.19429C7.97924 0.719538 6.99561 0.471097 5.99618 0.471681C4.99674 0.472264 4.0134 0.721861 3.13611 1.19764C2.25881 1.67341 1.51555 2.36017 0.974331 3.19512H2.46065C3.54806 3.22794 4.58608 3.65379 5.38012 4.39281ZM2.33044 8.54598C2.67027 8.22617 3.59176 7.32276 4.48579 6.44372C3.75149 5.72164 3.06857 5.05386 2.7866 4.78862C2.42478 4.40333 1.9435 4.14963 1.41958 4.06801L0.504293 4.06273C0.142217 4.88969 -0.0287564 5.78676 0.00394418 6.68802C0.0366448 7.58927 0.272183 8.47179 0.693251 9.27068L0.964889 9.26628C1.48815 9.18417 1.96879 8.93065 2.33044 8.54598ZM9.14401 4.79037C9.14401 4.79037 8.37339 5.54297 7.45604 6.44402C8.55793 7.52962 9.5987 8.54567 9.5987 8.54567C9.5987 8.54567 10.3687 9.27597 11.1187 9.27597H11.3035C11.726 8.47592 11.9624 7.59178 11.9952 6.68882C12.0279 5.78586 11.8562 4.88712 11.4927 4.05892H10.6628C9.91344 4.05862 9.14401 4.79008 9.14401 4.79008V4.79037ZM6.97773 8.90158C6.97773 8.90158 6.75422 8.68094 6.41055 8.34059C6.38916 8.31856 6.37408 8.29125 6.36687 8.26149C6.35965 8.23173 6.36056 8.20058 6.36951 8.17129C6.59437 7.65584 6.88717 7.17239 7.24021 6.73361L7.2659 6.61067C7.2659 6.61067 5.16045 8.7047 4.92542 8.94001C4.13079 9.67932 3.09221 10.1054 2.00418 10.1386H1.25276C1.81 10.863 2.52766 11.4502 3.3501 11.8545C4.17254 12.2588 5.07765 12.4694 5.99522 12.47C6.9128 12.4706 7.81817 12.2612 8.64114 11.8579C9.46411 11.4547 10.1826 10.8684 10.7407 10.1447H9.95802C8.27891 10.1444 6.97773 8.90129 6.97773 8.90129V8.90158Z" fill="white" />
                                                                </svg>
                                                                <span className='ms-1 text-light' style={{ fontSize: '13px' }}>{beneficio.monedas}</span>
                                                            </div>
                                                            <p className="fs-16-bold text-fucsia">{beneficio.titulo3}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {beneficio.monedas == 0 &&
                                                    <div className="ms-3 text-start">
                                                        <p className="fs-16-bold mb-3">{beneficio.titulo1}</p>
                                                        <p className="fs-16-bold text-fucsia">{beneficio.titulo3}</p>
                                                    </div>
                                                }
                                            </Link>
                                            <div className="text-end p-3">
                                                {beneficio.distancia !== 0 &&
                                                    <p className="fs-14 d-flex flex-row">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                                            <path d="M14.875 8.47217C14.875 13.8194 8 18.4027 8 18.4027C8 18.4027 1.125 13.8194 1.125 8.47217C1.125 6.6488 1.84933 4.90012 3.13864 3.61081C4.42795 2.3215 6.17664 1.59717 8 1.59717C9.82336 1.59717 11.572 2.3215 12.8614 3.61081C14.1507 4.90012 14.875 6.6488 14.875 8.47217Z" stroke="#8F8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M7.99998 10.764C9.26563 10.764 10.2916 9.73798 10.2916 8.47233C10.2916 7.20668 9.26563 6.18066 7.99998 6.18066C6.73433 6.18066 5.70831 7.20668 5.70831 8.47233C5.70831 9.73798 6.73433 10.764 7.99998 10.764Z" stroke="#8F8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span className="ms-1 text-gris mb-2">{beneficio.distancia}km</span>
                                                    </p>
                                                }
                                                <button onClick={() => handleFavorito(index)} className="btn-none m-1">
                                                    {beneficio.esFavorito ?
                                                        <svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M13.5231 6.39093C13.2839 5.78493 13.113 5.22094 12.851 4.69894C10.9314 0.846968 6.10106 0.52297 3.48653 3.52295C1.84604 5.40694 1.50427 7.60892 2.11946 10.0209C2.71185 12.3609 3.9707 14.2989 5.50866 16.0509C7.12636 17.8989 8.99469 19.4168 11.0852 20.6228C11.763 21.0128 12.4579 21.3668 13.17 21.6908C13.375 21.7808 13.6826 21.7628 13.8934 21.6728C16.5136 20.4908 18.8319 18.8408 20.8597 16.7229C22.4262 15.0909 23.7306 13.2849 24.5451 11.1189C25.166 9.44491 25.3939 7.74092 24.8926 5.98293C24.1236 3.28295 21.5205 1.32097 18.8661 1.51296C16.3199 1.69896 14.4858 3.27095 13.6655 5.88094C13.62 6.04293 13.5744 6.20493 13.5231 6.39093Z" fill="#EC008B" stroke="#EC008B" strokeWidth="2" strokeLinejoin="round" />
                                                        </svg>
                                                        :
                                                        <svg width="27" height="23" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.9802 5.34749C11.1852 4.80883 11.3317 4.3075 11.5563 3.8435C13.2017 0.419527 17.3419 0.131529 19.583 2.79818C20.9891 4.47283 21.282 6.43015 20.7547 8.57414C20.247 10.6541 19.168 12.3768 17.8497 13.9341C16.4631 15.5768 14.8617 16.9261 13.0698 17.9981C12.4888 18.3447 11.8932 18.6594 11.2829 18.9474C11.1071 19.0274 10.8435 19.0114 10.6628 18.9314C8.41692 17.8807 6.42978 16.4141 4.69164 14.5314C3.34898 13.0808 2.23091 11.4755 1.53273 9.55013C1.00055 8.06214 0.805251 6.54749 1.2349 4.98483C1.89403 2.58485 4.12528 0.840858 6.40048 1.01152C8.58292 1.17686 10.155 2.57418 10.8581 4.89416C10.8972 5.03816 10.9362 5.18216 10.9802 5.34749Z" stroke="#EC008B" strokeWidth="2" strokeLinejoin="round" />
                                                        </svg>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </LazyComponent>
                                ))}
                            </div>
                            :
                            <div className='d-flex justify-content-center align-items-center flex-column p-3 mt-4'>
                                <img className="" src={`${window.location.origin}/img/pantalla-beneficios/Ilus-ben-grises-1.svg`} width="135px" height="168px"/>
                                <p className='fs-18-400 my-2 text-center'>No hay resultádos que coincidan con tu búsqueda, prueba utilizar otras palabras o navegar el listado de todos los beneficios que tenemos para ti</p>
                                <button className='btn btn-azul fs-16-bold my-2 mt-4 w-100'>Ver todos los beneficios</button>
                            </div>
                        }
                        
                    </div>
                    <Footer />
                </div>
            </AuthenticatedTemplate >
            <UnauthenticatedTemplate>
                <Onboarding />
            </UnauthenticatedTemplate>
        </Fragment >
    )
}

export default BeneficiosBusqueda;
