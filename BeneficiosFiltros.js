import React, { Fragment, useEffect, useContext,useState, useRef, forwardRef, useImperativeHandle} from 'react';
import $ from 'jquery';
import CheckboxesFiltros from './CheckboxesFiltros';
import beneficiosContext from '../../context/beneficios/beneficiosContext';
import Swal from 'sweetalert2'


const BeneficiosFiltros = (props) => {
    const { buscarBeneficiosFiltrados, beneficiosMarcas, beneficiosDescuentos, beneficiosCategorias } = useContext(beneficiosContext);
    let isMounted = useRef(true);
    
    const [formData,setFormData] = useState({
        verTodos:false,
        masCercanos:{},
        marcas:[],
        descuentos:[],
        categorias:[]
    });

    useEffect(()=>{
        show_up_filters();

        return ()=>{
            shut_down_filters();
        }

    },[beneficiosMarcas])


    function show_up_filters() {
        darken_screen2(true);
        document.getElementById('navbar_filters').classList.remove('hide-menu-filters');
        document.getElementById('navbar_filters').classList.add('show-menu-filters');
    }
    function shut_down_filters() {
        darken_screen2(false);
        props.setMostrarFiltros(false);
    }
    
    function darken_screen2(yesno) {
        if (yesno === true) {
            document.querySelector('.screen-darken').classList.add('active');
        } else if (yesno === false) {
            document.querySelector('.screen-darken').classList.remove('active');
        }
    }

    $('#screen-dark').click((e)=>{
        shut_down_filters();
        backToMenu();
    })
    $('#btn-hide-menu-filters').click((e)=>{
        shut_down_filters();   
    })

    const hide_filter_menu=()=>{
        shut_down_filters();   
    }

    const enable_filters=(nombreFiltro)=>{
        switch(nombreFiltro){
            case "Ver todos":
                    if(props.valoresFiltros.verTodos==false){
                        props.setValoresFiltros({
                            ...props.valoresFiltros,
                            verTodos:!props.valoresFiltros.verTodos,
                            porMarca:false,
                            porCategoria:false,
                            porDescuento:false
                        }); 
                        
                        props.checkboxLists.beneficiosMarcas.map((elem,index)=>(
                            elem.checked=false
                        ));
                        props.checkboxLists.beneficiosDescuentos.map((elem,index)=>(
                            elem.checked=false
                        ));
                        props.checkboxLists.beneficiosCategorias.map((elem,index)=>(
                            elem.checked=false
                        ));
                                    
                        props.expandirFiltros.filtroMarca=false;
                        props.expandirFiltros.filtroDescuento=false;
                        props.expandirFiltros.filtroCategoria=false;
                    }

                break;

            case "Mas cercanos":
                if(props.valoresFiltros.masCercanos==false){
                    navigator.geolocation.getCurrentPosition((data) =>{ 
                            props.setValoresFiltros({
                                ...props.valoresFiltros,
                                masCercanos:true
                            });
                        }, 
                        (err) => {
                            props.setValoresFiltros({
                                ...props.valoresFiltros,
                                masCercanos:false
                            });
                            Swal.fire({
                                html: `
                                <p class="fs-24-bold mt-4">Hay increíbles beneficios cerca tuyo</p>
                                <img class="my-3" src=${window.location.origin}/img/geolocalizacion.svg width="175px" alt="Imágen de geolocalización" />
                                <p class="fs-14-400">Debes activar tu ubicación en tu dispositivo móvil para encontrar beneficios cercanos</p>
                                `,
                                confirmButtonText: 'Aceptar',
                                showCloseButton: true,
                                closeButtonHtml: `
                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.2095 1.70711C18.6001 1.31658 18.6001 0.683417 18.2095 0.292893C17.819 -0.0976311 17.1859 -0.0976311 16.7953 0.292893L9.50122 7.587L2.20711 0.292893C1.81658 -0.0976311 1.18342 -0.0976311 0.792893 0.292893C0.402369 0.683417 0.402369 1.31658 0.792893 1.70711L8.087 9.00122L0.792893 16.2953C0.402369 16.6859 0.402369 17.319 0.792893 17.7095C1.18342 18.1001 1.81658 18.1001 2.20711 17.7095L9.50122 10.4154L16.7953 17.7095C17.1859 18.1001 17.819 18.1001 18.2095 17.7095C18.6001 17.319 18.6001 16.6859 18.2095 16.2953L10.9154 9.00122L18.2095 1.70711Z" fill="#8F8E8E" />
                                </svg>
                                `
                            })
                        });
                }
                else{
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        masCercanos:!props.valoresFiltros.masCercanos
                    });
                }
                break;
            case "Por marca":
                props.setExpandirFiltros({
                    ...props.expandirFiltros,
                    filtroMarca:!props.expandirFiltros.filtroMarca,
                });  
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    verTodosVer:!props.valoresFiltros.verTodosVer,
                    masCercanosVer:!props.valoresFiltros.masCercanosVer,
                    porCategoriaVer:!props.valoresFiltros.porCategoriaVer,
                    porDescuentoVer:!props.valoresFiltros.porDescuentoVer
                });
                
                break;
            case "Por categoria":
                props.setExpandirFiltros({
                    ...props.expandirFiltros,
                    filtroCategoria:!props.expandirFiltros.filtroCategoria,
                    verTodos:false,
                });  
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    verTodosVer:!props.valoresFiltros.verTodosVer,
                    masCercanosVer:!props.valoresFiltros.masCercanosVer,
                    porMarcaVer:!props.valoresFiltros.porMarcaVer,
                    porDescuentoVer:!props.valoresFiltros.porDescuentoVer
                });

                break;
            case "Por descuento":
                props.setExpandirFiltros({
                    ...props.expandirFiltros,
                    filtroDescuento:!props.expandirFiltros.filtroDescuento,
                });
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    verTodosVer:!props.valoresFiltros.verTodosVer,
                    masCercanosVer:!props.valoresFiltros.masCercanosVer,
                    porMarcaVer:!props.valoresFiltros.porMarcaVer,
                    porCategoriaVer:!props.valoresFiltros.porCategoriaVer
                });
                break;
        }
    }
    
    const quitarFilros=()=>{
        props.setCheckboxLists({
            ...props.checkboxLists,
            beneficiosMarcas: beneficiosMarcas,
            beneficiosCategorias: beneficiosCategorias,
            beneficiosDescuentos: beneficiosDescuentos
        })
        props.checkboxLists.beneficiosMarcas.map((elem,index)=>{
            if(elem.checked==true) elem.checked=false;
        })
        props.checkboxLists.beneficiosCategorias.map((elem,index)=>{
            if(elem.checked==true) elem.checked=false;
        })
        props.checkboxLists.beneficiosDescuentos.map((elem,index)=>{
            if(elem.checked==true) elem.checked=false;
        })

        props.setValoresFiltros({
            ...props.valoresFiltros,
            verTodos:true,
            porMarca:false,
            porCategoria:false,
            porDescuento:false
        });

        props.setExpandirFiltros({
            filtroMarca:false,
            filtroCategoria:false,
            filtroDescuento:false
        })
    }

    const disable_filters=(nombreFiltro)=>{
        switch(nombreFiltro){
            case "Ver todos":
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    verTodos:!props.valoresFiltros.verTodos
                });    
                break;
            case "Mas cercanos":
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    masCercanos:!props.valoresFiltros.masCercanos
                });
                break;
            case "Por marca":
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    porMarca:!props.valoresFiltros.porMarca
                });
                beneficiosMarcas.forEach((elem,index)=>{
                    elem.checked=false;
                })  
                break;
            case "Por categoria":
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    porCategoria:!props.valoresFiltros.porCategoria
                });
                beneficiosCategorias.forEach((elem,index)=>{
                    elem.checked=false;
                })  
                break;
            case "Por descuento":
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    porDescuento:!props.valoresFiltros.porDescuento,
                });
                beneficiosDescuentos.forEach((elem,index)=>{
                    elem.checked=false;
                })  
                break;
        }
    }

    const backToMenu= ()=>{
        props.setValoresFiltros({
            ...props.valoresFiltros,
            verTodosVer:true,
            masCercanosVer:true,
            porCategoriaVer:true,
            porMarcaVer:true,
            porDescuentoVer:true
        });
        props.setExpandirFiltros({
            ...props.expandirFiltros,
            filtroMarca:false,
            filtroCategoria:false,
            filtroDescuento:false,
        });
    }

    const buscarBeneficiosFiltrado = (e)=>{
        e.preventDefault();
        
        props.checkboxLists.beneficiosMarcas.forEach((elem,index)=>{
            if(elem.checked==true){
                formData.marcas.push({idMarca:elem.idMarca,nombre:elem.nombreMarca})
            }
        });
        props.checkboxLists.beneficiosDescuentos.forEach((elem,index)=>{
            if(elem.checked==true){
                formData.descuentos.push({idDescuento:elem.idDescuento,nombre:elem.cantidadDescuento})
            }
        });
        props.checkboxLists.beneficiosCategorias.forEach((elem,index)=>{
            if(elem.checked==true){
                formData.categorias.push({idCategoria:elem.idCategoria,nombre:elem.categoria})
            }
        });

        formData.verTodos=props.valoresFiltros.verTodos;

        var userLocation;
        if(props.valoresFiltros.masCercanos){

            if (isMounted.current) {
                navigator.geolocation.getCurrentPosition(position => {
    
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                }, function (e) {
                    userLocation = {
                        lat: 0,
                        lng: 0
                    }
    
                }, {
                    enableHighAccuracy: true
                })
            }
        }
        else{
            userLocation = {
                lat: 0,
                lng: 0
            }
        }
        setTimeout(() => {
            setFormData({
                ...formData,
                masCercanos:{
                    lat:userLocation.lat,
                    lon:userLocation.lng
                }
            });
            buscarBeneficiosFiltrados(formData,userLocation.lat,userLocation.lng);

            if(props.buscar) props.setBuscar("");
            props.setMostrarFiltros(false);
            backToMenu();
        }, 1000);
    }
    
    return (
        <Fragment>
            <nav id="navbar_filters" className='beneficios-filters-menu px-3'>
                <div className='d-flex justify-content-start align-items-center flex-row' > 
                    { props.valoresFiltros.porMarcaVer && props.valoresFiltros.porCategoriaVer && props.valoresFiltros.porDescuentoVer &&
                        <Fragment>
                            <button className='btn-none' onClick={()=>hide_filter_menu()}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289C12.0976 3.68342 12.0976 4.31658 11.7071 4.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L11.7071 19.2929C12.0976 19.6834 12.0976 20.3166 11.7071 20.7071C11.3166 21.0976 10.6834 21.0976 10.2929 20.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L10.2929 3.29289Z" fill="#0C1561" />
                                </svg>
                            </button>
                            <p className='ps-3 fs-16 text-azul'>Filtros de búsqueda</p>
                        </Fragment>
                    }
                    { props.valoresFiltros.porMarcaVer && !props.valoresFiltros.porCategoriaVer && !props.valoresFiltros.porDescuentoVer &&
                        <Fragment>
                            <button className='btn-none' onClick={()=>backToMenu()}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289C12.0976 3.68342 12.0976 4.31658 11.7071 4.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L11.7071 19.2929C12.0976 19.6834 12.0976 20.3166 11.7071 20.7071C11.3166 21.0976 10.6834 21.0976 10.2929 20.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L10.2929 3.29289Z" fill="#0C1561" />
                                </svg>
                            </button>
                            <p className='ps-3 fs-16 text-azul'>Filtrar por marca</p>
                        </Fragment>
                    }
                    { props.valoresFiltros.porCategoriaVer && !props.valoresFiltros.porMarcaVer && !props.valoresFiltros.porDescuentoVer && 
                        <Fragment>
                        <button className='btn-none' onClick={()=>backToMenu()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289C12.0976 3.68342 12.0976 4.31658 11.7071 4.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L11.7071 19.2929C12.0976 19.6834 12.0976 20.3166 11.7071 20.7071C11.3166 21.0976 10.6834 21.0976 10.2929 20.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L10.2929 3.29289Z" fill="#0C1561" />
                            </svg>
                        </button>
                        <p className='ps-3 fs-16 text-azul'>Filtrar por categoria</p>
                        </Fragment>
                    }
                    { props.valoresFiltros.porDescuentoVer && !props.valoresFiltros.porCategoriaVer && !props.valoresFiltros.porMarcaVer &&
                        <Fragment>
                        <button className='btn-none' onClick={()=>backToMenu()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289C12.0976 3.68342 12.0976 4.31658 11.7071 4.70711L5.41421 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H5.41421L11.7071 19.2929C12.0976 19.6834 12.0976 20.3166 11.7071 20.7071C11.3166 21.0976 10.6834 21.0976 10.2929 20.7071L2.29289 12.7071C1.90237 12.3166 1.90237 11.6834 2.29289 11.2929L10.2929 3.29289Z" fill="#0C1561" />
                            </svg>
                        </button>
                        <p className='ps-3 fs-16 text-azul'>Filtrar por descuento</p>
                        </Fragment>
                    }
                </div>
                <form onSubmit={(e)=>buscarBeneficiosFiltrado(e)} className="mt-3 pt-2" >
                    { props.valoresFiltros.verTodosVer &&
                        <button type="button" onClick={()=>enable_filters("Ver todos")} className={!props.valoresFiltros.verTodos ? 'btn btn-none w-100 box-white-without-shadow d-flex justify-content-start align-items-center my-3 border borde-gris-claro':'w-100 btn btn-none box-white d-flex justify-content-start align-items-center my-3 shadow'} style={{height:'51px'}}>     
                            { props.valoresFiltros.verTodos ?
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Checked.svg`} width="24px" height="24px"/>
                                :
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Unchecked.svg`} width="24px" height="24px"/>
                            }
                            <p className='ms-2 fs-14 text-dark'>Ver todos</p>
                        </button>
                    }
                    { props.valoresFiltros.masCercanosVer &&
                        <button type="button" onClick={()=>enable_filters("Mas cercanos")} className={!props.valoresFiltros.masCercanos ? 'btn btn-none w-100 box-white-without-shadow d-flex justify-content-start align-items-center my-3 border borde-gris-claro':'w-100 btn btn-none box-white d-flex justify-content-start align-items-center my-3 shadow'} style={{height:'51px'}}>     
                            { props.valoresFiltros.masCercanos ?
                                <img className="ms-2 " src={`${window.location.origin}/img/pantalla-beneficios/Checked.svg`} width="24px" height="24px"/>
                                :
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Unchecked.svg`} width="24px" height="24px"/>
                            }
                            <p className='ms-2 fs-14 text-dark'>Más cercanos</p>
                        </button>
                    }
                    { props.valoresFiltros.porMarcaVer &&
                        <button type="button" onClick={()=>enable_filters("Por marca")} className={!props.valoresFiltros.porMarca ? 'btn btn-none w-100 box-white-without-shadow d-flex justify-content-start align-items-center my-0 border borde-gris-claro':'w-100 btn btn-none box-white d-flex justify-content-start align-items-center my-3 shadow'} style={{height:'51px'}}>     
                            { props.valoresFiltros.porMarca ?
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Checked.svg`} width="24px" height="24px"/>
                                :
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Unchecked.svg`} width="24px" height="24px"/>
                            }
                            <p className='ms-2 fs-14 text-dark'>Por marca</p>
                        </button>
                    }
                    <div className=''>
                        { props.expandirFiltros.filtroMarca &&
                            <CheckboxesFiltros list={props.checkboxLists.beneficiosMarcas} setValoresFiltros={props.setValoresFiltros} valoresFiltros={props.valoresFiltros} activarVerTodos={props.activarVerTodos} />
                        }
                    </div>
                    { props.valoresFiltros.porCategoriaVer &&
                        <button type="button" onClick={()=>enable_filters("Por categoria")} className={!props.valoresFiltros.porCategoria ? 'btn btn-none w-100 box-white-without-shadow d-flex justify-content-start align-items-center my-3 border borde-gris-claro':'w-100 btn btn-none box-white d-flex justify-content-start align-items-center my-3 shadow'} style={{height:'51px'}}>     
                            { props.valoresFiltros.porCategoria ?
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Checked.svg`} width="24px" height="24px"/>
                                :
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Unchecked.svg`} width="24px" height="24px"/>
                            }
                            <p className='ms-2 fs-14 text-dark'>Por categoría</p>
                        </button>
                    }
                    <div>
                        { props.expandirFiltros.filtroCategoria &&
                            <CheckboxesFiltros list={props.checkboxLists.beneficiosCategorias} setValoresFiltros={props.setValoresFiltros} valoresFiltros={props.valoresFiltros} activarVerTodos={props.activarVerTodos} />
                        }
                    </div>
                    { props.valoresFiltros.porDescuentoVer &&
                        <button type="button" onClick={()=>enable_filters("Por descuento")} className={!props.valoresFiltros.porDescuento ? 'btn btn-none w-100 box-white-without-shadow d-flex justify-content-start align-items-center my-3 border borde-gris-claro':'w-100 btn btn-none box-white d-flex justify-content-start align-items-center my-3 shadow'} style={{height:'51px'}}>     
                            { props.valoresFiltros.porDescuento ?
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Checked.svg`} width="24px" height="24px"/>
                                :
                                <img className="ms-2" src={`${window.location.origin}/img/pantalla-beneficios/Unchecked.svg`} width="24px" height="24px"/>
                            }
                            <p className='ms-2 fs-14 text-dark'>Por descuento</p>
                        </button>
                    }
                    <div>
                        { props.expandirFiltros.filtroDescuento &&
                            <CheckboxesFiltros list={props.checkboxLists.beneficiosDescuentos} setValoresFiltros={props.setValoresFiltros} valoresFiltros={props.valoresFiltros} activarVerTodos={props.activarVerTodos} />
                        }
                    </div>
                    <div className='d-flex justify-content-start align-items-center flex-column py-3'>
                        <button type='submit' className='btn btn-azul w-100'>Aplicar</button>
                        <button type="button" className='btn-none mt-3' onClick={quitarFilros}>Limpiar filtros aplicados</button>
                    </div>
                </form>
            </nav>    
            {props.children}                  
        </Fragment >
    )
}

export default BeneficiosFiltros;
