// Smooth scroll for "Get Started" button
document.querySelector(".get-started").addEventListener("click", e => {
    e.preventDefault();
    document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});


       // Store comet division position
        let cometDivision = null;
        let divisionBounds = null;
        
        // Get comet division bounds
        function getDivisionBounds() {
            cometDivision = document.querySelector('.comet-background');
            const rect = cometDivision.getBoundingClientRect();
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            divisionBounds = {
                top: rect.top + scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                bottom: rect.bottom + scrollY,
                right: rect.right,
                scrollY: scrollY
            };
            
            return divisionBounds;
        }
        
        // Create PERSISTENT stars - within comet division only
        function createStars() {
            const starsContainer = document.getElementById('stars-container');
            const bounds = getDivisionBounds();
            const starCount = 100; // Reduced for division only
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Position stars within comet division
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 1.5 + 0.4;
                
                star.style.left = x + '%';
                star.style.top = y + '%';
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                
                // Random animation
                star.style.animationDelay = Math.random() * 8 + 's';
                star.style.animationDuration = (5 + Math.random() * 6) + 's';
                
                starsContainer.appendChild(star);
            }
        }
        
        // Create a single comet within comet division only
        function createComet() {
            const cometContainer = document.getElementById('comet-container');
            const bounds = getDivisionBounds();
            
            const comet = document.createElement('div');
            comet.className = 'comet';
            
            // Start from a random edge of the division
            const startSide = Math.floor(Math.random() * 4);
            let startX, startY;
            
            // Convert to percentage within division
            switch(startSide) {
                case 0: // Top edge
                    startX = Math.random() * 100;
                    startY = -2; // Just above
                    break;
                case 1: // Right edge
                    startX = 102; // Just right
                    startY = Math.random() * 100;
                    break;
                case 2: // Bottom edge
                    startX = Math.random() * 100;
                    startY = 102; // Just below
                    break;
                case 3: // Left edge
                    startX = -2; // Just left
                    startY = Math.random() * 100;
                    break;
            }
            
            comet.style.left = startX + '%';
            comet.style.top = startY + '%';
            
            // Color variations
            const colors = [
                'rgba(255, 255, 255, 0.95)',
                'rgba(135, 206, 235, 0.9)',
                'rgba(173, 216, 230, 0.9)',
                'rgba(224, 255, 255, 0.9)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            comet.style.backgroundColor = color;
            comet.style.boxShadow = `0 0 15px 4px ${color}`;
            
            cometContainer.appendChild(comet);
            
            // Calculate end point (opposite side)
            let endX, endY;
            
            switch(startSide) {
                case 0: // From top to bottom
                    endX = Math.random() * 100;
                    endY = 102; // Just below
                    break;
                case 1: // From right to left
                    endX = -2; // Just left
                    endY = Math.random() * 100;
                    break;
                case 2: // From bottom to top
                    endX = Math.random() * 100;
                    endY = -2; // Just above
                    break;
                case 3: // From left to right
                    endX = 102; // Just right
                    endY = Math.random() * 100;
                    break;
            }
            
            // Calculate angle and distance
            const angle = Math.atan2(endY - startY, endX - startX);
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const speed = 0.15; // Slower speed for percentage movement
            
            // Create trail
            const trail = document.createElement('div');
            trail.className = 'trail';
            trail.style.left = startX + '%';
            trail.style.top = startY + '%';
            trail.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
            trail.style.background = `linear-gradient(90deg, transparent, ${color}66, transparent)`;
            
            cometContainer.appendChild(trail);
            
            return {
                element: comet,
                trail: trail,
                x: startX,
                y: startY,
                endX: endX,
                endY: endY,
                angle: angle,
                distance: distance,
                speed: speed,
                progress: 0,
                color: color,
                isVisible: false,
                container: cometContainer
            };
        }
        
        // Fade in the comet
        function fadeInComet(comet) {
            comet.element.style.opacity = '0.85';
            comet.isVisible = true;
        }
        
        // Fade out the comet
        function fadeOutComet(comet) {
            comet.element.style.opacity = '0';
            comet.isVisible = false;
            
            // Fade out trail
            if (comet.trail) {
                comet.trail.style.opacity = '0';
                setTimeout(() => {
                    if (comet.trail.parentNode) comet.trail.remove();
                }, 1500);
            }
            
            // Remove comet after fade out
            setTimeout(() => {
                if (comet.element.parentNode) comet.element.remove();
            }, 2000);
        }
        
        // Update comet position
        function updateComet(comet) {
            if (!comet.isVisible) return;
            
            // Move comet
            comet.progress += comet.speed / comet.distance;
            comet.x = comet.x + Math.cos(comet.angle) * comet.speed;
            comet.y = comet.y + Math.sin(comet.angle) * comet.speed;
            
            // Update position
            comet.element.style.left = comet.x + '%';
            comet.element.style.top = comet.y + '%';
            
            // Update trail
            if (comet.trail) {
                comet.trail.style.left = comet.x + '%';
                comet.trail.style.top = comet.y + '%';
                comet.trail.style.transform = `rotate(${comet.angle * 180 / Math.PI}deg)`;
                comet.trail.style.opacity = 0.8 - (comet.progress * 0.8);
            }
            
            // Check if comet has reached destination or out of bounds
            const distanceToEnd = Math.sqrt(
                Math.pow(comet.endX - comet.x, 2) + 
                Math.pow(comet.endY - comet.y, 2)
            );
            
            // Check if within reasonable bounds of division
            const inBounds = comet.x >= -5 && comet.x <= 105 &&
                            comet.y >= -5 && comet.y <= 105;
            
            if (distanceToEnd < 2 || comet.progress >= 0.98 || !inBounds) {
                fadeOutComet(comet);
                return false; // Comet finished
            }
            
            return true; // Comet still moving
        }
        
        // Comet manager
        class CometManager {
            constructor() {
                this.currentComet = null;
                this.animationId = null;
                this.isPaused = false;
                this.startContinuousComets();
            }
            
            startContinuousComets() {
                // Start first comet immediately
                this.currentComet = createComet();
                setTimeout(() => {
                    fadeInComet(this.currentComet);
                    this.animate();
                }, 300);
            }
            
            animate() {
                if (this.isPaused || !this.currentComet) return;
                
                const stillMoving = updateComet(this.currentComet);
                
                if (stillMoving) {
                    this.animationId = requestAnimationFrame(() => this.animate());
                } else {
                    // Comet finished, start new one after delay
                    this.currentComet = null;
                    
                    setTimeout(() => {
                        this.currentComet = createComet();
                        setTimeout(() => {
                            fadeInComet(this.currentComet);
                            this.animate();
                        }, 200);
                    }, 1000);
                }
            }
            
            pause() {
                this.isPaused = true;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            }
            
            resume() {
                this.isPaused = false;
                if (this.currentComet) {
                    this.animate();
                } else {
                    this.startContinuousComets();
                }
            }
        }
        
        // Initialize everything
        window.addEventListener('load', () => {
            createStars();
            
            // Start comet manager
            const cometManager = new CometManager();
            
            // Handle window resize
            window.addEventListener('resize', () => {
                getDivisionBounds();
            });
            
            // Pause/resume on visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    cometManager.pause();
                } else {
                    cometManager.resume();
                }
            });
        });
