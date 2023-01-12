import './App.css';
import { useEffect, useState, useRef } from 'react';
import Footer from './components/Footer';

function App() {
  const [ingredientList, setIngredientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeNotFound, setRecipeNotFound] = useState(false);
  const inputRef = useRef(null);
  const API_KEY = process.env.REACT_APP_RECIPE_URL
  const APP_ID = process.env.REACT_APP_RECIPE_ID;
  const searchHandle = () => {
    searchForRecipie(inputRef.current.value);
    inputRef.current.value = "";
  }
  const searchForRecipie = (query) => {
    setLoading(true);
    let url = `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${API_KEY}`
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(res => {
        console.log(res.hits);
        if(res.hits.length === 0) {
           setRecipeNotFound(true)
           setLoading(false)
        } else {
          setIngredientList(res.hits)
          setLoading(false)
          setRecipeNotFound(false)
        }
        
      })
      .catch(err => {
        console.log("error", err);
        setLoading(false);
      })
  }

  useEffect(() => {
    searchForRecipie('Rice')
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='inputWrapper'>
          <input ref={inputRef} placeholder='Search For Recipe' />
          <button onClick={searchHandle}>Search</button>
        </div>
        {loading && <p>Loading...</p>}
        {recipeNotFound && <p className='notFound'>I don't think there is any ingredient with this name.</p>}
        <div className='wrapper'>
          {ingredientList.map(({ recipe }) => {
            return (
              <>
              <div key={recipe.label} className="ingredient">
                <span>{recipe.label}</span>
                <img src={recipe.image} />
                <div className='step' id="style-7">
                  {recipe.ingredientLines.map((step, index) => {
                    return <p key={index}>{step}</p>
                  })}
                </div>
              </div>
              </>
            )
          })}
        </div>
        <Footer />
      </header>
    </div>
  )
}

export default App;