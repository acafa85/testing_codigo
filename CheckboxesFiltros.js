import { useEffect, useContext } from "react";
import beneficiosContext from "../../context/beneficios/beneficiosContext";
import $ from 'jquery';


const CheckboxesFiltros = (props) => {
    const { beneficiosMarcas, beneficiosDescuentos, beneficiosCategorias } = useContext(beneficiosContext);

    const filter_clicked=(type,index)=>{
        var mostrar=false;
        props.list[index].checked=!props.list[index].checked;
        
        props.list.forEach((item,index)=>{
            if(item.checked == true) mostrar=true;
        })

        switch(type){
            case "marca":
                if(mostrar==true){
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porMarca:mostrar,
                        verTodos:false
                    });
                }
                else{
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porMarca:mostrar
                    });
                }
                break;
            case "categoria":
                if(mostrar == true){
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porCategoria:mostrar,
                        verTodos:false
                    });
                }
                else{
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porCategoria:mostrar,
                    });
                }
                break;
            case "descuento":
                if(mostrar==true){
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porDescuento:mostrar,
                        verTodos:false
                    });
                }
                else{
                    props.setValoresFiltros({
                        ...props.valoresFiltros,
                        porDescuento:mostrar
                    });
                }
                break;
        }
        if(mostrar==false) {
            if(props.activarVerTodos(type)){
                props.setValoresFiltros({
                    ...props.valoresFiltros,
                    verTodos:true,
                    porMarca:false,
                    porCategoria:false,
                    porDescuento:false
                });
            }
        }
    }
                
    return props.list.map((item, index) => {
        return (
            <div key={index} >
                { item.nombreMarca &&
                    <div>
                        <input
                            className='chk-filtros'
                            type="checkbox"
                            id={item.idMarca}
                            onClick={()=>filter_clicked("marca",index)}
                            defaultChecked={item.checked}
                            />
                        <label className="fs-13-500" htmlFor={item.idMarca} >{item.nombreMarca}</label>
                    </div>
                }
                { item.cantidadDescuento &&
                    <div>
                        <input
                            className='chk-filtros'
                            type="checkbox"
                            id={item.idDescuento}
                            onClick={()=>filter_clicked("descuento",index)}
                            defaultChecked={item.checked}
                            />
                        <label className="fs-13-500" htmlFor={item.idDescuento} >{item.cantidadDescuento}</label>
                    </div>
                }
                { item.categoria &&
                    <div>
                        <input
                            className='chk-filtros'
                            type="checkbox"
                            id={item.idCategoria}
                            onClick={()=>filter_clicked("categoria",index)}
                            defaultChecked={item.checked}
                            />
                        <label className="fs-13-500" htmlFor={item.idCategoria}>{item.categoria}</label>
                    </div>
                }
            </div>
        );
    });
};

export default CheckboxesFiltros;
