import React from "react";

const SECURITY_CODE = 'paradigma'

function UseReducer({ name }) {
    // creacion del estado con useReducer
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // actualizaciones del estado
    const onConfirm = () => dispatch({ type: actionTypes.confirm });
    const onError = () => dispatch({ type: actionTypes.error });
    const onCheck = () => dispatch({ type: actionTypes.check });
    const onDelete = () => dispatch({ type: actionTypes.delete });
    const onReset = () => dispatch({ type: actionTypes.reset });
    const onWrite = ({ target: { value }}) => {
        dispatch({ type: actionTypes.write, payload: value });
    };
// efectos de la interfaz y llamados de las funciones de cambio de estado
    React.useEffect(() => {
        if(!!state.loading) {
            setTimeout(() => {
                console.log("Loading state...")

                if (state.value === SECURITY_CODE) {
                    onConfirm()
                } else {
                    onError()
                }    

                console.log("Loaded state!")
            }, 3000)
        }
    }, [state.loading])

    if (!state.deleted && !state.confirmed) {
        return(
            <div>
                <h2>Eliminar {name} </h2>

                <p>Por favor, escribe el código de seguridad.</p>

                {(state.error && !state.loading) && (
                    <p>Error: el código es incorrecto</p>
                )}
                {state.loading && (
                    <p>Cargando...</p>
                )}

                <input 
                    placeholder='Código de seguridad' 
                    value={state.value}
                    onChange={onWrite}
                />
                <button onClick={onCheck}>
                    Comprobar
                </button>
            </div>
        );
    } else if (!!state.confirmed && !state.deleted) {
        return(
            <React.Fragment>
                <p>Pedimos confirmación. ¿Estas seguro?</p>
                <button onClick={onDelete}>
                    Si, eliminar
                </button>
                <button onClick={onReset}>
                    No, me arrepentí
                </button>
            </React.Fragment>
        );
    } else {
        return(
            <React.Fragment>
                <p>Eliminado con exito!</p>
                <button onClick={onReset}>
                    resetear, volver atras
                </button>
            </React.Fragment>
        )
    }
}

const initialState = {
    value: '',
    error: false,
    loading: false,
    deleted: false,
    confirmed: false,
}

const actionTypes = {
    confirm: 'CONFIRM',
    delete: 'DELETE',
    error: 'ERROR',
    write: 'WRITE',
    reset: 'RESET',
}

// // mas común
// const reducerIf = (state, action) => {
//     if (action.type === 'ERROR'){
//         return { 
//             ...state,
//             error: true,
//             loading: false,
//         };
//     } else if (action.type === 'CHECK'){
//         return{
//             ...state,
//             loading: true,
//         }
//     } else {
//         return {
//             ...state
//         }
//     }
// }

// // mas popular
// const reducerSwitch = (state, action) => {
//     switch (action.type) {
//         case 'ERROR':
//             return { 
//                 ...state,
//                 error: true,
//                 loading: false,
//             };
//         case 'CHECK':
//             return {
//                 ...state,
//                 loading: true,
//             }
//         default:
//             return {
//                 ...state,
//             }
//     }
// }

// me parece mejor
const reducerObject = (state, payload) => ({
    [actionTypes.confirm]: { 
        ...state,
        error: false,
        loading: false,
        confirmed: true,
    },
    [actionTypes.error]: { 
        ...state,
        error: true,
        loading: false,
    },
    [actionTypes.write]:{ 
        ...state,
        value: payload,
    },
    [actionTypes.check]: { 
        ...state,
        loading: true,
    },
    [actionTypes.delete]:{
        ...state,
        deleted: true,
    },
    [actionTypes.reset]:{
        ...state,
        confirmed: false,
        deleted: false,
        value:'',
    },
})

const reducer = (state, action) => {
    if (reducerObject(state)[action.type]){
        return reducerObject(state, action.payload)[action.type];
    } else{
        return state;
    }
}

export { UseReducer }