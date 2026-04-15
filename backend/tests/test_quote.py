import pytest
from unittest.mock import patch, MagicMock
from services.yfinance_service import YFinanceService
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@patch('services.yfinance_service.yf.Ticker')
def test_get_quote_data_success(mock_ticker):
    mock_info = {
        'currentPrice': 150.0,
        'previousClose': 145.0,
        'volume': 1000000
    }
    mock_ticker.return_value.info = mock_info
    
    result = YFinanceService.get_quote_data('AAPL')
    assert result == (150.0, ((150.0 - 145.0) / 145.0) * 100, 1000000)

@patch('services.yfinance_service.yf.Ticker')
def test_get_quote_data_symbol_not_found(mock_ticker):
    mock_ticker.return_value.info = {}

    with pytest.raises(Exception) as exc_info:
        YFinanceService.get_quote_data('INVALID')
    # HTTPException stores the message in .detail, not in str()
    assert "Symbol not found" in exc_info.value.detail

def test_quote_endpoint():
    with patch('services.yfinance_service.YFinanceService.get_quote_data') as mock_get:
        mock_get.return_value = (150.0, 3.45, 1000000)
        
        response = client.get('/api/v1/quote/AAPL')
        assert response.status_code == 200
        data = response.json()
        assert data['symbol'] == 'AAPL'
        assert data['current_price'] == 150.0
        assert data['percent_change'] == 3.45
        assert data['volume'] == 1000000