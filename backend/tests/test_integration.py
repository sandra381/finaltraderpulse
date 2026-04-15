import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@patch('services.yfinance_service.YFinanceService.get_quote_data')
@patch('services.gemini_service.GeminiService.analyze_sentiment')
def test_sentiment_endpoint(mock_analyze, mock_get_quote):
    mock_get_quote.return_value = (150.0, 3.45, 1000000)
    mock_analyze.return_value = {"sentiment": "Bullish", "justification": "Strong performance"}
    
    response = client.get('/api/v1/sentiment/AAPL')
    assert response.status_code == 200
    data = response.json()
    assert data['symbol'] == 'AAPL'
    assert data['sentiment'] == 'Bullish'
    assert data['justification'] == 'Strong performance'
    assert 'timestamp' in data

@patch('services.yfinance_service.YFinanceService.get_quote_data')
def test_sentiment_endpoint_quote_error(mock_get_quote):
    mock_get_quote.side_effect = Exception("Quote error")
    
    response = client.get('/api/v1/sentiment/AAPL')
    assert response.status_code == 500
    assert "Quote error" in response.json()['detail']

def test_cors_headers():
    response = client.options('/api/v1/quote/AAPL', headers={
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET'
    })
    assert response.status_code == 200
    assert 'access-control-allow-origin' in response.headers
    assert response.headers['access-control-allow-origin'] == 'http://localhost:3000'

def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}