import useForm from "../hooks/useForm"
import { useNavigate } from 'react-router-dom';
import * as auth from "./Auth"

const Login = ({ handleLogin, openErrorInfoTooltip }) => {
    const navigate = useNavigate();
    const { values, handleChange, setValues } = useForm({});

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (!values.email || !values.password) {
            return;
        }
        auth.authorize(values.email, values.password)
            .then((res) => {
                if (res.token) {
                    setValues({ email: '', password: '' });
                    handleLogin()
                    navigate('/', { replace: true });
                }
            })
            .catch(err => {
                console.log(err)
                openErrorInfoTooltip(true)
            })
    }

    return (
        <div className="sign-data">
            <h2 className="sign-data__title">Вход</h2>
            <form onSubmit={handleSubmit} className="sign-data__form">
                <input onChange={handleChange} name="email" className="sign-data__input" type="email" placeholder="Email" />
                <input onChange={handleChange} name="password" className="sign-data__input" type="password" placeholder="Пароль" />
                <button className="sign-data__submit" type="submit">Войти</button>
            </form>
        </div>
    )
}

export default Login