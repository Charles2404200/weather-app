import time
from typing import Optional, Any
from datetime import datetime, timedelta


class SimpleCache:
    """Simple in-memory cache with TTL support."""
    
    def __init__(self):
        self._cache: dict[str, tuple[Any, float]] = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if it exists and hasn't expired."""
        if key not in self._cache:
            return None
        
        value, expiry_time = self._cache[key]
        if time.time() > expiry_time:
            del self._cache[key]
            return None
        
        return value
    
    def set(self, key: str, value: Any, ttl_seconds: int = 600) -> None:
        """Set value in cache with TTL."""
        expiry_time = time.time() + ttl_seconds
        self._cache[key] = (value, expiry_time)
    
    def delete(self, key: str) -> None:
        """Delete value from cache."""
        if key in self._cache:
            del self._cache[key]
    
    def clear(self) -> None:
        """Clear all cache."""
        self._cache.clear()
    
    def cleanup_expired(self) -> None:
        """Remove all expired entries from cache."""
        current_time = time.time()
        expired_keys = [
            key for key, (_, expiry_time) in self._cache.items()
            if current_time > expiry_time
        ]
        for key in expired_keys:
            del self._cache[key]


# Global cache instance
cache = SimpleCache()
