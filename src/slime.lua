local Slime = {}

function Slime.generate()
    local segments = {}
    for i = 1, 5 do
        local segX = 800 * i
        local seg = {
            x = segX,
            y = 300,
            h = 200 + love.math.random(0, 150),
            w = 20,
            color = {0, 1, 0},
            phase = 0
        }
        table.insert(segments, seg)
    end
    return segments
end

function Slime.update(segments, dt)
    for _, sl in ipairs(segments) do
        sl.phase = sl.phase + dt
        sl.offset = math.sin(sl.phase) * 10
    end
end

function Slime.checkCollision(segments, hero, dt, isFlying)
    hero.isOnSlime = false
    if not isFlying then
        for _, sl in ipairs(segments) do
            local slimeRect = {
                x = sl.x,
                y = sl.y + (sl.offset or 0),
                w = sl.w,
                h = sl.h
            }
            if hero.x + hero.w > slimeRect.x and hero.x < slimeRect.x + slimeRect.w and
               hero.y + hero.h > slimeRect.y and hero.y < slimeRect.y + slimeRect.h then
                hero.isOnSlime = true
                break
            end
        end
    end

    if hero.isOnSlime and not isFlying then
        hero.rychlostY = 0
        if love.keyboard.isDown("up") then
            hero.y = hero.y - 100 * dt
        end
    end
end

return Slime
