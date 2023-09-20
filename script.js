document.getElementById("calculate").addEventListener("click", calculateDelivery);

        function calculateDelivery() {
            const start = document.getElementById("start").value;
            const end = document.getElementById("end").value;
            const startDateString = document.getElementById("startDate").value;
            const startDate = new Date(startDateString);
            
            const routeMap = {
                "Tirunelveli": {
                    "Madurai": 2
                },
                "Madurai": {
                    "Tirunelveli": 2,
                    "Trichy": 2,
                    "Coimbatore": 3,
                    "Salem": 3
                },
                "Trichy": {
                    "Chennai": 3
                },
                "Coimbatore": {
                    "Chennai": 3,
                    "Bangalore": 3
                },
                "Salem": {
                    "Bangalore": 2
                },
                "Chennai": {
                    "Bangalore": 2,
                    "Mumbai": 5
                },
                "Bangalore": {
                    "Mumbai": 3
                }
            };
            
            const result = findShortestRoute(routeMap, start, end);
            
            if (!result) {
                document.getElementById("result").textContent = "Route not found";
                return;
            }
            
            let currentDate = new Date(startDate);
            let totalDays = result.days;
            
            while (totalDays > 0) {
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    totalDays--;
                }
            }
            
            const formattedEndDate = currentDate.toLocaleDateString();
            const route = result.route.join(" -> ");
            document.getElementById("result").textContent = `Route: ${route}\nTotal Days: ${result.days}\n ${startDate +"->"}\n Arrive on: ${formattedEndDate}`;
        }
        
        function findShortestRoute(routeMap, start, end) {
            const visited = new Set();
            const queue = [{ node: start, days: 0, route: [start] }];
            
            while (queue.length > 0) {
                const current = queue.shift();
                visited.add(current.node);
                if (current.node === end) {
                    let possibleRoutes = Array.from(queue);
                    possibleRoutes = possibleRoutes.filter(routes => routes.node == end);
                    let closest = possibleRoutes.reduce(
                        (acc, loc) => {
                                return acc.days <= loc.days
                                ? acc
                                : loc
                            
                        }


                      )
                    if (closest.days >= current.days) {
                        return current;
                    } else {
                        return closest;
                    }
                }
                
                for (const neighbor in routeMap[current.node]) {
                    if (!visited.has(neighbor)) {
                        const days = current.days + routeMap[current.node][neighbor];
                        const route = [...current.route, neighbor];
                        queue.push({ node: neighbor, days, route });
                    }
                }
            }
            
            return null; // No route found
        }

