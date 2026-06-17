import { Building, BuildingId } from '../data/content';

type CampusMapProps = {
  buildings: Building[];
  activeId: BuildingId;
  onHover: (id: BuildingId) => void;
  onLeave: () => void;
  onSelect: (building: Building) => void;
};

type Point = [number, number];

type MapArea = {
  id: BuildingId;
  points: Point[];
};

// Координаты заданы в процентах от изображения карты.
// Чтобы поправить область, редактируй точки points: [x, y].
const mapAreas: MapArea[] = [
  {
    id: '1',
    points: [
      [60.0, 14.2],
      [76.6, 14.2],
      [76.6, 22.4],
      [76.1, 22.4],
      [76.1, 43.1],
      [78.6, 43.1],
      [78.6, 44.2],
      [80.1, 44.2],
      [80.1, 57.5],
      [78.6, 57.5],
      [78.6, 58.3],
      [76.1, 58.3],
      [76.1, 78.6],
      [76.7, 78.6],
      [76.7, 87.0],
      [72.7, 87.0],
      [72.7, 86.5],
      [60.2, 86.5],
      [60.2, 79.0],
      [69.7, 79.0],
      [69.7, 54.1],
      [68.2, 54.1],
      [68.2, 54.8],
      [62.3, 54.8],
      [62.3, 46.7],
      [68.3, 46.7],
      [68.3, 47.5],
      [69.8, 47.5],
      [69.7, 43.5],
      [70.0, 43.5],
      [70.0, 21.9],
      [60.0, 21.9],
    ],
  },
  {
    id: '2',
    points: [
      [27.2, 18.4],
      [40.3, 18.4],
      [40.3, 17.5],
      [41.1, 17.5],
      [41.1, 14.9],
      [43.2, 14.9],
      [43.2, 17.5],
      [44.0, 17.5],
      [44.0, 18.5],
      [55.6, 18.5],
      [55.6, 25.4],
      [48.0, 25.4],
      [48.0, 27.0],
      [36.4, 27.0],
      [36.4, 25.3],
      [28.8, 25.3],
      [28.8, 22.9],
      [27.4, 21.4],
    ],
  },
  {
    id: '3',
    points: [
      [52.2, 25.3],
      [57.4, 25.3],
      [57.4, 35.9],
      [52.2, 35.9],
    ],
  },
  {
    id: '4',
    points: [
      [26.9, 25.3],
      [32.2, 25.3],
      [32.2, 35.9],
      [26.9, 35.9],
    ],
  },
  {
    id: '5',
    points: [
      [10.6, 14.5],
      [24.5, 14.7],
      [24.3, 22.5],
      [22.4, 22.5],
      [22.5, 21.5],
      [15.5, 21.5],
      [15.5, 31.7],
      [18.5, 31.7],
      [18.5, 43.8],
      [21.8, 43.8],
      [21.8, 57.7],
      [18.5, 57.7],
      [18.5, 70.0],
      [15.7, 70.0],
      [15.7, 80.2],
      [22.9, 80.2],
      [22.9, 79.3],
      [24.8, 79.3],
      [24.8, 87.1],
      [10.6, 87.1],
      [10.7, 67.2],
      [13.6, 67.2],
      [13.6, 34.4],
      [10.6, 34.4],
    ],
  },
  {
    id: '6',
    points: [
      [29.2, 66.4],
      [38.3, 66.4],
      [38.3, 78.9],
      [45.4, 78.9],
      [45.4, 86.7],
      [28.5, 86.7],
      [28.5, 79.0],
      [29.2, 79.0],
    ],
  },
  {
    id: '7',
    points: [
      [28.8, 54.3],
      [54.0, 54.3],
      [54.0, 62.2],
      [28.8, 62.2],
    ],
  },
  {
    id: '8',
    points: [
      [47.4, 71.4],
      [54.3, 71.4],
      [54.3, 85.7],
      [47.4, 85.7],
    ],
  },
  {
    id: '9',
    points: [
      [32.5, 38.2],
      [51.1, 38.2],
      [53.2, 39.3],
      [54.5, 42.7],
      [54.5, 47.0],
      [53.2, 50.3],
      [51.2, 52.0],
      [32.5, 52.0],
      [29.7, 50.2],
      [28.5, 47.0],
      [28.5, 42.0],
      [30.2, 39.0],
    ],
  },
  {
    id: 'P',
    points: [
      [54.6, 78.4],
      [57.4, 78.4],
      [57.4, 86.8],
      [54.6, 86.8],
    ],
  },
];

const toClipPath = (points: Point[]) => `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
const toSvgPoints = (points: Point[]) => points.map(([x, y]) => `${x},${y}`).join(' ');

export function CampusMap({ buildings, activeId, onHover, onLeave, onSelect }: CampusMapProps) {
  const findBuilding = (id: BuildingId) => buildings.find((building) => building.id === id);

  return (
    <div className="mapShell" aria-label="Интерактивная карта кампуса ДВГУПС">
      <div className="campusMapImageWrap">
        <img
          className="campusMapImage"
          src="/media/campus-map.png"
          alt="Схема территории ДВГУПС с корпусами 1-9 и парковкой"
        />

        <svg className="campusMapHighlight" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {mapAreas.map((area) => (
            <polygon key={area.id} points={toSvgPoints(area.points)} className={activeId === area.id ? 'isActive' : ''} />
          ))}
        </svg>

        <div className="campusMapOverlay" aria-label="Кликабельные области карты">
          {mapAreas.map((area) => {
            const building = findBuilding(area.id);
            if (!building) return null;

            return (
              <button
                type="button"
                key={area.id}
                className="mapArea"
                style={{ clipPath: toClipPath(area.points) }}
                onMouseEnter={() => onHover(area.id)}
                onMouseLeave={onLeave}
                onFocus={() => onHover(area.id)}
                onBlur={onLeave}
                onClick={() => onSelect(building)}
                aria-label={`${building.title}. Открыть описание объекта`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
