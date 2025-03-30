local Hero = {}

function Hero.new()
    return {
        x = 50,
        y = 580,
        w = 20,
        h = 20,

        baseSpeed = HERO_BASE_SPEED,
        rychlost = HERO_BASE_SPEED,
        rychlostY = 0,
        naZemi = false,
        maxSkoku = HERO_MAX_JUMPS,
        zbyvajiciSkoky = HERO_MAX_JUMPS,

        health = {
            red = 3,
            pink = 3,
        },
        activeColor = "red",
        colors = {
            red = {1, 0, 0},
            pink = {1, 0.7, 0.8},
        },

        isBig = false,
        hasCilindr = false,
        hasSmoking = false,
        spaceDrzeno = false,
        switchCooldown = 0,

        flyCloud = nil,
        isOnSlime = false,

        getColor = function(self)
            return self.colors[self.activeColor]
        end,

        takeDamage = function(self)
            if godMode then return end

            if self.isBig then
                self.isBig = false
                self.rychlost = self.baseSpeed
                return
            end

            self.health[self.activeColor] = self.health[self.activeColor] - 1
            if self.health[self.activeColor] <= 0 then
                if self.activeColor == "red" then
                    if self.health["pink"] > 0 then
                        self.activeColor = "pink"
                    else
                        gameOver = true
                    end
                else
                    if self.health["red"] > 0 then
                        self.activeColor = "red"
                    else
                        gameOver = true
                    end
                end
            end
        end,

        switchColor = function(self)
            if self.activeColor == "red" and self.health["pink"] > 0 then
                self.activeColor = "pink"
            elseif self.activeColor == "pink" and self.health["red"] > 0 then
                self.activeColor = "red"
            end
        end,
    }
end

return Hero
