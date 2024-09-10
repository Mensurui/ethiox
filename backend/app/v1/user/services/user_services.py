from fastapi import Depends, HTTPException
from ....config import get_db
from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.orm import joinedload, aliased
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import desc
from ..schemas import user_schemas
from ...admin.models import admin_models
from ..utils import user_utils
from typing import List, Optional

'''
async def exchange_list(currency_id:int, db: AsyncSession = Depends(get_db)):
    exchange_query = (
            select(admin_models.DailyExchangeRate)
            .options(
                joinedload(admin_models.DailyExchangeRate.bank),
                joinedload(admin_models.DailyExchangeRate.currency)
                )
            .join(admin_models.DailyExchangeRate.currency)
            .filter(admin_models.Currency.id == currency_id)
            .order_by(desc(admin_models.DailyExchangeRate.date))
            )
    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()

    exchange_listed = [
        user_schemas.ExchangeRateOut(
            id=x.id,
            transactional_buying_price = x.transactional_buying_price,
            transactional_selling_price = x.transactional_selling_price,
            cash_buying_price = x.cash_buying_price,
            cash_selling_price = x.cash_selling_price,
            bank_name=x.bank.bank_name,
            currency_name=x.currency.currency_name,
            currency_icon=x.currency.currency_icon
        )
        for x in exchange_list
    ]
    print(f"Exchange List: {exchange_list}")
    return exchange_listed
'''
async def exchange_list(currency_id: int, db: AsyncSession = Depends()):
    # Subquery to get the latest date for each bank
    subquery = (
        select(
            admin_models.DailyExchangeRate.bank_id,
            func.max(admin_models.DailyExchangeRate.date).label("latest_date")
        )
        .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
        .subquery()
    )
    
    # Main query to select unique bank data based on the latest date
    exchange_query = (
        select(admin_models.DailyExchangeRate)
        .join(
            subquery,
            (admin_models.DailyExchangeRate.bank_id == subquery.c.bank_id) &
            (admin_models.DailyExchangeRate.date == subquery.c.latest_date)
        )
        .where(admin_models.DailyExchangeRate.currency_id == currency_id)
        .options(
            joinedload(admin_models.DailyExchangeRate.bank),
            joinedload(admin_models.DailyExchangeRate.currency)
        )
        .order_by(desc(admin_models.DailyExchangeRate.date))
    )
    
    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()

    exchange_listed = [
        user_schemas.ExchangeRateOut(
            id=x.id,
            transactional_selling_price=x.transactional_selling_price,
            transactional_buying_price=x.transactional_buying_price,
            cash_selling_price=x.cash_selling_price,
            cash_buying_price=x.cash_buying_price,
            bank_name=x.bank.bank_name,
            currency_name=x.currency.currency_name,
            currency_icon=x.currency.currency_icon
        )
        for x in exchange_list
    ]
    return exchange_listed



async def top_sellingrate(currency_id:int, db:AsyncSession = Depends(get_db)):
    latest_rate_subquery = (
            select(
                admin_models.DailyExchangeRate.bank_id,
                func.max(admin_models.DailyExchangeRate.date).label("latest_date")
            )
            .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
            .subquery()
            )

    DailyExchangeRateAlias = aliased(admin_models.DailyExchangeRate)

    exchange_query = (
    select(DailyExchangeRateAlias)
    .join(
        latest_rate_subquery,
        (DailyExchangeRateAlias.bank_id == latest_rate_subquery.c.bank_id) &
        (DailyExchangeRateAlias.date == latest_rate_subquery.c.latest_date)
    )
    .options(
        joinedload(DailyExchangeRateAlias.bank),
        joinedload(DailyExchangeRateAlias.currency)
    )
    .filter(DailyExchangeRateAlias.currency.has(
        admin_models.Currency.id == currency_id  # Correct comparison for filtering
        ))
    .order_by(desc(DailyExchangeRateAlias.date))  # Sorting by date in descending order_by
    )

    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()
    exchange_listed = [
            user_schemas.ExchangeRateOutTSP(
                id=x.id,
                transactional_selling_price=x.transactional_selling_price,
                bank_name=x.bank.bank_name,
                currency_name=x.currency.currency_name,
                currency_icon=x.currency.currency_icon
                )
            for x in exchange_list
            ]

    top_three = await user_utils.top_three_sp(exchange_listed)
    return top_three

async def top_buyingrate(currency_id:int, db:AsyncSession = Depends(get_db)):
    latest_rate_subquery = (
            select(
                admin_models.DailyExchangeRate.bank_id,
                func.max(admin_models.DailyExchangeRate.date).label("latest_date")
            )
            .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
            .subquery()
            )

    DailyExchangeRateAlias = aliased(admin_models.DailyExchangeRate)

    exchange_query = (
    select(DailyExchangeRateAlias)
    .join(
        latest_rate_subquery,
        (DailyExchangeRateAlias.bank_id == latest_rate_subquery.c.bank_id) &
        (DailyExchangeRateAlias.date == latest_rate_subquery.c.latest_date)
    )
    .options(
        joinedload(DailyExchangeRateAlias.bank),
        joinedload(DailyExchangeRateAlias.currency)
    )
    .filter(DailyExchangeRateAlias.currency.has(
        admin_models.Currency.id == currency_id  # Correct comparison for filtering  # Correct comparison for filtering
        ))
    .order_by(desc(DailyExchangeRateAlias.date))  # Sorting by date in descending order_by
    )

    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()
    exchange_listed = [
            user_schemas.ExchangeRateOutTBP(
                id=x.id,
                transactional_buying_price=x.transactional_buying_price,
                bank_name=x.bank.bank_name,
                currency_name=x.currency.currency_name,
                currency_icon=x.currency.currency_icon
                )
            for x in exchange_list
            ]
    print(f"List: {exchange_listed}")

    top_three = await user_utils.top_three_bp(exchange_listed)
    return top_three


async def currency_list(db:AsyncSession=Depends(get_db)):
    curr_query = select(admin_models.Currency)
    curr_aff = await db.execute(curr_query)
    curr_data = curr_aff.scalars().all()
    return curr_data

async def images_urls(db: AsyncSession) -> List[admin_models.PromotionalImages]:
    img_query = select(admin_models.PromotionalImages)
    img_aff = await db.execute(img_query)
    img_data = img_aff.scalars().all()
    return img_data

async def top_cashsellingrate(currency_id:int, db:AsyncSession = Depends(get_db)):
    latest_rate_subquery = (
            select(
                admin_models.DailyExchangeRate.bank_id,
                func.max(admin_models.DailyExchangeRate.date).label("latest_date")
            )
            .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
            .subquery()
            )

    DailyExchangeRateAlias = aliased(admin_models.DailyExchangeRate)

    exchange_query = (
    select(DailyExchangeRateAlias)
    .join(
        latest_rate_subquery,
        (DailyExchangeRateAlias.bank_id == latest_rate_subquery.c.bank_id) &
        (DailyExchangeRateAlias.date == latest_rate_subquery.c.latest_date)
    )
    .options(
        joinedload(DailyExchangeRateAlias.bank),
        joinedload(DailyExchangeRateAlias.currency)
    )
    .filter(DailyExchangeRateAlias.currency.has(
        admin_models.Currency.id == currency_id  # Correct comparison for filtering # Correct comparison for filtering
        ))
    .order_by(desc(DailyExchangeRateAlias.date))  # Sorting by date in descending order_by
    )

    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()
    exchange_listed = [
            user_schemas.ExchangeRateOutCSP(
                id=x.id,
                cash_selling_price=x.cash_selling_price,
                bank_name=x.bank.bank_name,
                currency_name=x.currency.currency_name,
                currency_icon=x.currency.currency_icon
                )
            for x in exchange_list
            ]
    print(f"List: {exchange_listed}")

    top_three = await user_utils.top_three_csp(exchange_listed)
    return top_three

async def top_cashbuyingrate(currency_id:int, db:AsyncSession = Depends(get_db)):
    latest_rate_subquery = (
            select(
                admin_models.DailyExchangeRate.bank_id,
                func.max(admin_models.DailyExchangeRate.date).label("latest_date")
            )
            .group_by(admin_models.DailyExchangeRate.bank_id, admin_models.DailyExchangeRate.currency_id)
            .subquery()
            )

    DailyExchangeRateAlias = aliased(admin_models.DailyExchangeRate)

    exchange_query = (
    select(DailyExchangeRateAlias)
    .join(
        latest_rate_subquery,
        (DailyExchangeRateAlias.bank_id == latest_rate_subquery.c.bank_id) &
        (DailyExchangeRateAlias.date == latest_rate_subquery.c.latest_date)
    )
    .options(
        joinedload(DailyExchangeRateAlias.bank),
        joinedload(DailyExchangeRateAlias.currency)
    )
    .filter(DailyExchangeRateAlias.currency.has(
        admin_models.Currency.id == currency_id  # Correct comparison for filtering  # Correct comparison for filtering
        ))
    .order_by(desc(DailyExchangeRateAlias.date))  # Sorting by date in descending order_by
    )

    exchange_data = await db.execute(exchange_query)
    exchange_list = exchange_data.scalars().all()
    exchange_listed = [
            user_schemas.ExchangeRateOutCBP(
                id=x.id,
                cash_buying_price=x.cash_buying_price,
                bank_name=x.bank.bank_name,
                currency_name=x.currency.currency_name,
                currency_icon=x.currency.currency_icon
                )
            for x in exchange_list
            ]
    print(f"List: {exchange_listed}")

    top_three = await user_utils.top_three_cbp(exchange_listed)
    return top_three

async def get_article(article_id:Optional[str]=None, db:AsyncSession=Depends(get_db)):
    if not article_id:
        article_query = select(admin_models.Articles)
        article_exec = await db.execute(article_query)
        article_result = article_exec.scalars().all()
    else:
        article_query = select(admin_models.Articles).where(admin_models.Articles.id == article_id).options(joinedload(admin_models.Articles.article_category))
        article_exec = await db.execute(article_query)
        article_result = article_exec.scalars().all()
        article_data = [user_schemas.ArticleOut(
            title=article.title,
            sub_title=article.sub_title,
            content=article.content,
            source=article.source,
            author=article.author,
            article_category_id=article.article_category_id,
            article_category_name=article.article_category.article_category_name, 
            date_published=article.date_published
        )for article in article_result]
        return article_data
    if not article_result:
        raise HTTPException(status_code=405, detail=f"No data")


async def get_title_articles(db:AsyncSession=Depends(get_db)) -> List[user_schemas.ArticlesShowcaseMore]:
    try:
        articles_query = select(admin_models.Articles).order_by(desc(admin_models.Articles.date_published)).options(joinedload(admin_models.Articles.article_category))
        articles_exec = await db.execute(articles_query)
        articles_result = articles_exec.scalars().all()
        if not articles_result:
            raise HTTPException(status_code=405, details=f"No data")
    
        articles_listed = [
            user_schemas.ArticlesShowcaseMore(
                id = articles.id,
                title = articles.title,
                source = articles.source,
                date_published = articles.date_published,
                article_category_name = articles.article_category.article_category_name
                    )for articles in articles_result
        ]
        return articles_listed
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Error: {e}")

async def related_news(category:int, db:AsyncSession=Depends(get_db)) -> List[user_schemas.ArticlesShowcaseMore]:
    query = select(admin_models.Articles).where(admin_models.Articles.article_category_id == category).options(joinedload(admin_models.Articles.article_category))
    exec = await db.execute(query)
    results = exec.scalars().all()

    if not results:
        raise HTTPException(status_code=403, details=f"No data")

    related_articles = [
        user_schemas.ArticlesShowcaseMore(
            id = articles.id,
            title = articles.title,
            source = articles.source,
            date_published = articles.date_published,
            article_category_name = articles.article_category.article_category_name
        )for articles in results
    ]
    return related_articles
