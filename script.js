document.getElementById("calculate").addEventListener("click", calculateDelivery);

        function calculateDelivery() {
            const start = document.getElementById("start").value;
            const end = document.getElementById("end").value;
            const startDateString = document.getElementById("startDate").value;
            const startDate = new Date(startDateString);

            const shortestRoute =document.getElementById("route");
            const shortestRouteStart =document.getElementById("startResult");
            const shortestEndStart =document.getElementById("endResult");
            const routeResult = document.getElementById("result");
            routeResult.textContent = "";


            shortestRoute.textContent = "";
            shortestRouteStart.textContent = "";
            shortestEndStart.textContent = "";
            
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
            } else {
                const routePath = result.route;
                var routeKms = [];
                for (var i = 0; i < routePath.length-1; i++) {
                    routeKms.push(routeMap[routePath[i]][routePath[i+1]]);    
                }
            }
            
            let currentDate = new Date(startDate);
            let totalDays = result.days;
            let weekends = 0;
            
            while (totalDays > 0) {
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    totalDays--;
                } else {
                    weekends++;
                }
            }
            result.days = result.days + weekends;
            const dateOfEnd = currentDate.getDate();
            const monthOfEnd = currentDate.toLocaleString('default', { month: 'long' });
            const route = result.route.join(" -> ");
            const dateOfStart = startDate.getDate();
            const monthOfStart = startDate.toLocaleString('default', { month: 'long' });
            shortestRoute.textContent = `Route: ${route}\nTotal Days: ${ routeKms.join("+") + "+" + weekends + "= " + result.days + " Days"}`;
            shortestRouteStart.textContent =  "Start ->" + dateOfStart + "st " + monthOfStart;
            shortestEndStart.textContent =  "Arrive on ->" + dateOfEnd + "st " + monthOfEnd;
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
                    if (possibleRoutes.length !== 0) {
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
                    return current;

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

