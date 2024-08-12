import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en:{
                translation:{
                    header:'Ethiopian Live Forex Rates at Your Fingertips',
                    subheader:'Track. Compare. Trade Now.',
                    sellingTable:{
                        title: 'Live Top Selling Price',
                        bankName: 'Bank Name',
                        sellingPrice: 'Selling Price'
                    },
                    buyingTable:{
                        title:'Live Top Buying Price',
                        bankName:'Bank Name',
                        buyingPrice:'Buying Price'
                    },
                    userTable:{
                        title:'Live Forex Rates from All Banks',
                        subTitle:'Stay updated with the latest forex rates',
                        bankName:'Bank Name',
                        currencyName:'Currency Name',
                        sellingPrice:'Selling Price',
                        buyingPrice:'Buying Price',
                        more:'More',
                        subUserTable:{
                            currencyIcon:'Currency Icon',
                            date:'Date',
                            hour:'Hour'
                        }
                    }
                }
            },
            am:{
                translation:{
                    header:'የኢትዮፕያ የውጪ  ምንዛሬ ገበያ ከሁሉም ባንኮች በቀጥታ',
                    subheader:'ይከታተሉ። ያወዳድሩ። ይገበያዩ።',
                    sellingTable:{
                        title:'ከፍተኛ የመሸጫ ዋጋ ቀጥታ ስርጭት',
                        bankName:'የባንክ ስም',
                        sellingPrice:'የመሸጫ ዋጋ'
                    },
                    buyingTable:{
                        title:'ከፍተኛ የመግዛ ዋጋ ቀጥታ ስርጭት',
                        bankName:'የባንክ ስም',
                        buyingPrice:'የመግዛ ዋጋ'
                    },
                    userTable:{
                        title:'የውጪ ምንዛሬ ተመን ከሁሉም ባንኮች በቀጥታ',
                        subTitle:'አዳዲስ የፎሬክስ ምንዛሬ ግብይቶችን በቀጥታ ይከታተሉ',
                        bankName:'የባንክ ስም',
                        currencyName:'የምንዛሬ ስም',
                        sellingPrice:'የመሸጫ ዋጋ',
                        buyingPrice:'የመግዣ ዋጋ',
                        more:'ተጨማሪ መረጃ',
                        subUserTable:{
                            currencyIcon:'ምንዛሬ መለያ',
                            date:'ቀን',
                            hour:'ሰዐት'
                        }
                    }

                }
            }
        }
    })
