from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """Shared interface for future LaunchPilot AI agents."""

    @abstractmethod
    async def run(self, payload: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError

