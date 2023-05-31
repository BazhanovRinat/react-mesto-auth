import CorrectTooltip from '../images/correctInfoTooltip.svg';
import ErrorctTooltip from '../images/errorInfoTooltip.svg';

import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { CurrentUserContext } from "../contexts/CurrentUserContext.js"
import { api } from "../utils/Api.js"


import Header from './Header.js';
import Main from "./Main.js";
import Footer from "./Footer.js"
import ImagePopup from "./ImagePopup.js"
import Login from "./Login.js"
import Register from "./Register.js"
import NavBar from "./NavBar.js"
import ProtectedRouteElement from "./ProtectedRoute.js"
import * as auth from "./Auth"

import EditProfilePopup from "./EditProfilePopup.js"
import EditAvatarPopup from "./EditAvatarPopup.js"
import AddPlacePopup from "./AddPlacePopup.js"
import DeleteCardPopup from "./DeleteCardPopup.js"
import InfoTooltip from "./InfoTooltip.js"

NavBar()

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [deletedCard, setDeletedCard] = useState({})
  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard
  const [currentUser, setCurrentUser] = useState({})
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isPopupInfoTooltipCorrect, SetisPopupInfoTooltipCorrect] = useState(false)
  const [isPopupInfoTooltipError, SetisPopupInfoTooltipError] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    api.profileDataInstall()
      .then((data) => {
        setCurrentUser(data)
      })
      .catch((error) => {
        console.log(`${error}`);
      })

    api.getInitialCards()
      .then((data) => {
        setCards(data)
      })
      .catch((error) => {
        console.log(`${error}`);
      })
    tokenCheck();
  }, [])

  function tokenCheck() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if (token) {
        auth.getContent(token).then((res) => {
          if (res) {
            setLoggedIn(true);
            navigate("/", { replace: true })
          }
        })
      }
    }
  }


  function signOut() {
    localStorage.removeItem('token');
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)

  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen)

  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen)

  }

  function handleDeleteCardClick(card) {
    setDeletedCard(card)
    setIsDeleteCardPopupOpen(!isDeleteCardPopupOpen)
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsDeleteCardPopupOpen(false)
    SetisPopupInfoTooltipCorrect(false)
    SetisPopupInfoTooltipError(false)
    setSelectedCard(null)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => {
        console.log(`${error}`);
      });
  }

  function handleCardDelete(deletedCard) {
    api.deleteCard(deletedCard._id)
      .then(() => {
        setCards((state) => state.filter((newArr) => newArr !== deletedCard))
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`${error}`);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(!isLoading)
    api.setProfileInfo(data)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`${error}`);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleUpdateAvatar(data) {
    setIsLoading(!isLoading)
    api.setProfileAvatar(data)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`${error}`);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(!isLoading)
    api.postCard(data)
      .then((data) => {
        setIsLoading(!isLoading)
        setCards([data, ...cards]);
        closeAllPopups()
      })
      .catch((error) => {
        console.log(`${error}`);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleLogin() {
    setLoggedIn(true)
  }

  return (

    < div className="app" >
      <CurrentUserContext.Provider value={currentUser}>
        <Header signOut={signOut} />
        <Routes>
          <Route path="/sign-in" element={<Login
            handleLogin={handleLogin}
            openErrorInfoTooltip={SetisPopupInfoTooltipError}/>} />

          <Route path="/sign-up" element={<Register
            openCorrectInfoTooltip={SetisPopupInfoTooltipCorrect}
            openErrorInfoTooltip={SetisPopupInfoTooltipError}/>} />

          <Route path="*" element={<ProtectedRouteElement element={Main} loggedIn={loggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            cards={cards}
            onCardDelete={handleDeleteCardClick} />}
          />
        </Routes>
        <Footer />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateAvatar} isLoading={isLoading} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />
        <DeleteCardPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onDeleteCard={handleCardDelete} card={deletedCard} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isOpen} />
        <InfoTooltip isOpen={isPopupInfoTooltipCorrect} onClose={closeAllPopups} img={CorrectTooltip} title={"Вы успешно зарегистрировались!"} />
        <InfoTooltip isOpen={isPopupInfoTooltipError} onClose={closeAllPopups} img={ErrorctTooltip} title={"Что-то пошло не так! Попробуйте ещё раз."} />

      </CurrentUserContext.Provider>




      {/* <div className="popup popup-delete">
        <div className="popup__container popup-delete__container">
          <button type="button" className="popup__close"></button>
          <h2 className="popup__title popup-delete__title">Вы уверены?</h2>
          <button type="submit" className="popup__submit popup-delete__submit">Да</button>
        </div>
     
     </div> */}
    </div >
  )
}


export default App;
