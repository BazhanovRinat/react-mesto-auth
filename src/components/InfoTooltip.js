

function InfoTooltip({isOpen, onClose, img, title}) {
    return(
        <div className={isOpen ? `popup popup-infoTooltip popup_opened` : `popup`}>
            <div className={`popup__container popup-infoTooltip__container`}>
                <button type="button" className="popup__close popup-edit__close" onClick={() => onClose()}></button>
                <img className="popup-infoTooltip__image" src={img} alt="" />
                <h2 className={`popup-infoTooltip__title`}>{title}</h2>
            </div>
        </div>
    )
}

export default InfoTooltip