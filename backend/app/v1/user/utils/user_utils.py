from ..schemas import user_schemas

async def top_three_sp(exchange_listed:user_schemas.ExchangeRateOutTSP):
    sorted_xchange = sorted(exchange_listed, key=lambda x: x.transactional_selling_price, reverse=True)
    return sorted_xchange[:5]

async def top_three_bp(exchange_listed:user_schemas.ExchangeRateOutTBP):
    sorted_xchange = sorted(exchange_listed, key=lambda x:x.transactional_buying_price, reverse=True)
    return sorted_xchange[:5]

async def top_three_csp(exchange_listed:user_schemas.ExchangeRateOutCSP):
    sorted_xchange = sorted(exchange_listed, key=lambda x: x.cash_selling_price, reverse=True)
    return sorted_xchange[:5]

async def top_three_cbp(exchange_listed:user_schemas.ExchangeRateOutCBP):
    sorted_xchange = sorted(exchange_listed, key=lambda x:x.cash_buying_price, reverse=True)
    return sorted_xchange[:5]

