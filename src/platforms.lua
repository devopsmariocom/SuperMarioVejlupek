local Platforms = {}

function Platforms.generate(worldWidth)
    local platformy = {}

    -- Dolní podlaha
    table.insert(platformy, {
        x = 0,
        y = 580,
        w = worldWidth,
        h = 20,
        bounce = false,
        falling = false,
        color = {0.7, 0.3, 0.3}
    })

    local lastSafePlatform = platformy[1]

    local currentX = 50
    local currentY = 480
    local minXGap = 120
    local maxXGap = 180
    local minYDelta = -80
    local maxYDelta = 80
    local minWidth  = 100
    local maxWidth  = 200
    local bounceProbability  = 0.1
    local fallingProbability = 0.1

    while currentX < worldWidth - 300 do
        local gap = love.math.random(minXGap, maxXGap)
        currentX = currentX + gap
        local yDelta = love.math.random(minYDelta, maxYDelta)
        currentY = currentY + yDelta
        if currentY < 300 then currentY = 300 end
        if currentY > 580 then currentY = 580 end
        local platWidth = love.math.random(minWidth, maxWidth)
        local isBounce = (love.math.random() < bounceProbability)
        local isFalling = (love.math.random() < fallingProbability)
        local color = {0.7, 0.3, 0.3} -- Default color

        if isBounce then
            color = {0, 0, 0} -- Black for bounce
        elseif isFalling then
            color = {1, 1, 0} -- Yellow for falling
        end

        table.insert(platformy, {
            x = currentX,
            y = currentY,
            w = platWidth,
            h = 20,
            bounce = isBounce,
            falling = isFalling,
            color = color
        })
    end

    for i = 2, #platformy do
        local plat = platformy[i]
        if i % 3 == 0 and plat.y - 40 >= 0 and plat.y - 40 <= plat.y + 150 then
            table.insert(platformy, {
                x = plat.x + plat.w / 2 - 10,
                y = plat.y - 40,
                w = 20,
                h = 20,
                isMystery = true,
                color = {1, 1, 0}
            })
        end
    end

    return platformy, lastSafePlatform
end

return Platforms
