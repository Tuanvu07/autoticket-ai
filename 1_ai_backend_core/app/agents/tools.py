from langchain_core.tools import tool

@tool
def check_available_trips(origin: str, destination: str) -> str:
    """Kiểm tra các chuyến đi có sẵn dựa trên điểm đi và điểm đến."""
    return f"Mock: Có chuyến đi từ {origin} đến {destination}."

@tool
def book_ticket(trip_id: str, name: str, phone: str) -> str:
    """Đặt vé cho chuyến đi."""
    return f"Mock: Đặt vé thành công cho {name} ({phone}) trên chuyến {trip_id}."
