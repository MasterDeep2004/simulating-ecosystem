document.addEventListener('DOMContentLoaded', () => {
    const ecosystem = document.getElementById('ecosystem');
    const width = ecosystem.clientWidth;
    const height = ecosystem.clientHeight;
    const iter = document.getElementById("iter");
    const dayswithoutfoodlimit = 5;
    const range = 20;
    const mvmsize = 20;
    const dayswithoutfoodlimitinms = 4.32 * (10**8);//converted days into milliseconds

    class Entity {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.lastate = Date.now();//calculating when the entity ate last time
            this.element = document.createElement('div');
            this.element.classList.add('entity', type);
            this.updatePosition();
            ecosystem.appendChild(this.element);
        }

        updatePosition() {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }

        move() {
            const dx = (Math.random() - 0.5) * mvmsize;
            const dy = (Math.random() - 0.5) * mvmsize;
            this.x = Math.min(width - range, Math.max(0, this.x + dx));
            this.y = Math.min(height - range, Math.max(0, this.y + dy));
            this.updatePosition();
        }

        eat(){
            this.lastate = Date.now();//update the last ate time to now
        }
        dead(){
            return (Date.now() - this.lastate > dayswithoutfoodlimitinms);//will return true or false if the entity has died or not after the food limit
        }
    }

    const entities = [];

    // Create plants
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * (width - range);
        const y = Math.random() * (height - range);
        entities.push(new Entity(x, y, 'plant'));
    }

    // Create herbivores
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * (width - range);
        const y = Math.random() * (height - range);
        entities.push(new Entity(x, y, 'herbivore'));
    }

    // Create carnivores
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (width - range);
        const y = Math.random() * (height - range);
        entities.push(new Entity(x, y, 'carnivore'));
    }

    function updateEcosystem() {
        // Update the iteration counter
        let currentVal = parseInt(iter.textContent);
        currentVal++;
        iter.textContent = currentVal;

        entities.forEach((entity, index) => {
            if (entity.type !== 'plant') {
                entity.move();
                if (entity.dead()) {
                    ecosystem.removeChild(entity.element);
                    entities.splice(index, 1);
                    return; // Skip further processing for this entity
                    
                }
            }

            // Herbivores eat plants
            if (entity.type === 'herbivore') {
                entities.forEach((plant, plantIndex) => {
                    if (plant.type === 'plant' && Math.hypot(entity.x - plant.x, entity.y - plant.y) < range) {
                        ecosystem.removeChild(plant.element);
                        entities.splice(plantIndex, 1);
                        entity.eat();
                    }
                });
            }

            // Carnivores eat herbivores
            if (entity.type === 'carnivore') {
                entities.forEach((herbivore, herbivoreIndex) => {
                    if (herbivore.type === 'herbivore' && Math.hypot(entity.x - herbivore.x, entity.y - herbivore.y) < range) {
                        ecosystem.removeChild(herbivore.element);
                        entities.splice(herbivoreIndex, 1);
                        entity.eat();
                    }
                });
            }
        });
    }

    setInterval(updateEcosystem, 100);
});