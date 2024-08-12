from ..schemas import user_schemas

async def top_three_sp(exchange_listed:user_schemas.ExchangeRateOutSP):
    sorted_xchange = sorted(exchange_listed, key=lambda x: x.selling_price, reverse=True)
    return sorted_xchange[:5]

async def top_three_bp(exchange_listed:user_schemas.ExchangeRateOutBP):
    sorted_xchange = sorted(exchange_listed, key=lambda x:x.buying_price, reverse=True)
    return sorted_xchange[:5]
