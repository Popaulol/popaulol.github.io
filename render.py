import glob
import json
import time
from dataclasses import dataclass
from typing import Any, Self

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileSystemEvent
from staticjinja import Site


@dataclass(frozen=True)
class Character:
    name: str
    other_names: list[str]
    importance: str
    description: str
    relationships: dict[str, str]
    character_traits: list[str]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Self:
        return Character(
            name=data["name"],
            other_names=data["other_names"],
            importance=data["importance"],
            description=data["description"],
            relationships=data["relationships"],
            character_traits=data["character_traits"],
        )


@dataclass(frozen=True)
class Chapter:
    part: str
    number: int
    summary: str
    relationship_katniss_peeta: bool
    authority_power: bool
    media_effects_on_people: bool

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Self:
        return Chapter(
            part=data["part"],
            number=int(data["number"]),
            summary=data["summary"],
            relationship_katniss_peeta=data["relationship_katniss_peeta"],
            authority_power=data["authority_power"],
            media_effects_on_people=data["media_effects_on_people"],
        )

    def __lt__(self, other: Self) -> bool:
        return self.number < other.number


def characters() -> dict[str, list[Character]]:
    ret = {"characters": []}
    for file in glob.glob("characters/*.json"):
        with open(file, "r") as f:
            data = json.load(f)
            ret["characters"].append(Character.from_dict(data))

    ret["characters"].sort(key=lambda x: x.name)
    return ret


def chapters() -> dict[str, list[Chapter]]:
    ret = {"chapters": []}
    for file in glob.glob("chapters/*.json"):
        with open(file, "r") as f:
            data = json.load(f)
            ret["chapters"].append(Chapter.from_dict(data))
    ret["chapters"].sort()
    return ret


class CharacterChangeHandler(FileSystemEventHandler):
    def on_modified(self, event: FileSystemEvent | None) -> None:
        self.site.render()

    def __init__(self, site_, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.site = site_


if __name__ == "__main__":
    site = Site.make_site(
        contexts=[("hunger_games.html", characters), ("hunger_games.html", chapters)],
        mergecontexts=True,
    )
    print(characters())
    # enable automatic reloading

    site.render()

    observer = Observer()
    handler = CharacterChangeHandler(site)
    observer.schedule(handler, "./characters", recursive=True)
    observer.schedule(handler, "./templates", recursive=True)
    observer.schedule(handler, "./chapters", recursive=True)
    observer.start()
    handler.on_modified(None)
    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
