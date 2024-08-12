import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Admin from './Admin';
import User from './User';
import './custom-styles.css';
import { useTranslation } from 'react-i18next';

const App = () => {
    const { t, i18n } = useTranslation();
    const lngs = {
        en: { nativeName: 'English' },
        am: { nativeName: 'Amharic' }
    };

    return (
        <Router>
            <div className="has-background-info">
                <section className="hero is-info">
                    <div className="hero-body">
                        <p className="title has-text-centered">
                            {t('header')}
                        </p>
                        <p className="subtitle has-text-centered">
                            {t('subheader')}
                        </p>
                    </div>
                </section>

                <div className="tabs is-toggle is-centered is-info">
                    <ul>
                        {Object.keys(lngs).map((lng) => (
                            <li key={lng} className={i18n.resolvedLanguage === lng ? 'is-active' : ''}>
                                <button 
                                    className={`button is-primary is-light mx-2 ${i18n.resolvedLanguage === lng ? 'is-active' : ''}`} 
                                    onClick={() => i18n.changeLanguage(lng)}
                                >
                                    <span>{lngs[lng].nativeName}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="notification is-white">
                    <Routes>
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/" element={<Navigate to="/user" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

