import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function Search(){
    const navigate = useNavigate()
    const location = useLocation()
    const [keyword,setkeyword] = useState("")
    const SearchHandler = (e)=>{
        e.preventDefault()
        navigate(`/search/${keyword}`)
    }
    const clearKeyword = ()=>{
        setkeyword("")
    }
    useEffect(()=>{
        if(location.pathname === '/'){
            clearKeyword()
        }
    },[location])

    return(
        <form onSubmit={SearchHandler}>
        <div className="search-bar">
            
                    <input type="text" placeholder="Search for products..." 
                    onChange ={(e)=>{setkeyword(e.target.value)}}
                    value={keyword}/>
                    <button><FontAwesomeIcon icon={faSearch} className="icon" /></button>
                 
                </div>
                   </form>

    )
}