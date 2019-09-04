# phaser3-rabbits-and-foxes
This is a population simulation for rabbits and foxes based on some environment. This is a popular coding challenge and 
an interesting anthropological study as well. We will have an environment, which is basically a 2 dimensional grid with
a given width and height. There will be three entities living in this environment, which have a tight relationship
to one another. The first entity are grass, which will grow randomly. The second one are rabbits, which need to eat grass and drink water
in order to survive. Lastly there will also be foxes, which need to eat rabbits in order to survive. For each entity
there are given rules described later on. There will be time present in the environment. Every entity has a certain 
live span. Other properties like reproduction, hunger, thirst and many more are also time based.

## How to run

## Rules
We will describe the rules of the environment for each entity. These are the base rules for a standard environment

### Grass
* Grass can only grow on one tile at a time
* The likelyhood for each tile to grow grass is 25% per day
* Eating grass reduce hunger by 0.1 

### Rabbit
* Rabbits gain 0.1 hunger per hour
* Rabbits gain 0.1 thirst per hour
* Rabbits have a sight, which is 3 tiles in every direction
* Rabbits have life span of 9 years
* Rabbits die either their hunger reaches 1, their thirst reaches 1 or their lifespan exceeds

### Fox
* Foxes gain 0.15 hunger per hour
* Foxes gain 0.1 thirst per hour
* Foxes have a sight, which is 3 tiles in every direction
* Foxes have a life span of 5 years
* Foxes die either their hunger reaches 1, their thirst reaches 1 or their lifespan exceeds