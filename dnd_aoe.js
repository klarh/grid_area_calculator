
var render_scene = function()
{
    var canvas = new fabric.Canvas('main_elt', {selection: false})

    var pixel_scale = Math.floor(Math.min(window.innerWidth, window.innerHeight)/10)
    var max_size = Math.max(window.innerWidth, window.innerHeight)

    let pixel_scale_box = document.getElementById('pixel_scale_input')
    pixel_scale_box.value = pixel_scale
    let feet_per_square = 5
    let translucent_color = 'rgba(50, 70, 200, 0.5)'
    let control_size = document.getElementById('create_sphere').getBoundingClientRect().height*2
    let line_props = {strokeWidth: 3, stroke: 'black', selectable: false, evented: false}
    let group_props = {centeredRotation: false, originY: 'center',
                       lockScalingX: true, lockScalingY: true,
                       hasBorders: false, cornerSize: control_size,
                       transparentCorners: false,
                       cornerColor: 'rgba(25, 125, 35, 0.5)'}
    let control_viz = {bl: false, br: false, mb: false, ml: false,
                       mr: false, mt: false, tl: false, tr: false}

    let draw_lines = function() {
        let grid_lines = []

        for(i = 0; i*pixel_scale < window.innerWidth; i++)
        {
            grid_lines.push(new fabric.Line([i*pixel_scale, 0, i*pixel_scale, window.innerHeight], line_props))
        }
        for(j = 0; j*pixel_scale < window.innerHeight; j++)
        {
            grid_lines.push(new fabric.Line([0, j*pixel_scale, window.innerWidth, j*pixel_scale], line_props))
        }

        for(i = 0; i < grid_lines.length; i++)
        {
            canvas.add(grid_lines[i])
        }
    }

    let get_center_coords = function() {
        let half_line_width = line_props['strokeWidth']/2
        return [Math.round(window.innerWidth/pixel_scale/2)*pixel_scale + half_line_width,
                Math.round(window.innerHeight/pixel_scale/2)*pixel_scale + half_line_width]
    }

    let get_center_circle = function() {
        let center = get_center_coords()
        return new fabric.Circle({
            radius: 3*line_props['strokeWidth'],
            fill: 'black',
            originX: 'center', originY: 'center',
            left: center[0], top: center[1]
        })
    }

    let radius_box = document.getElementById('radius_input')

    let sphere_button = document.getElementById('create_sphere')
    let draw_sphere = function() {
        redrawCanvas()
        let radius = radius_box.value*pixel_scale/feet_per_square
        let center = get_center_coords()

        let large_circle = new fabric.Circle({
            radius: radius,
            fill: translucent_color,
            strokeWidth: line_props['strokeWidth'], stroke: 'black',
            originX: 'center', originY: 'center',
            left: center[0], top: center[1],
            selectable: false, evented: false,
        })

        let group = new fabric.Group(
            [large_circle, get_center_circle()],
            group_props)
        group.setControlsVisibility(control_viz)
        canvas.add(group)
    }
    sphere_button.addEventListener('click', draw_sphere)

    let cone_button = document.getElementById('create_cone')
    let draw_cone = function() {
        redrawCanvas()
        let half_line_width = line_props['strokeWidth']/2
        let radius = radius_box.value*pixel_scale/feet_per_square
        let center = get_center_coords()

        let cone = new fabric.Polygon(
            [
                {x: 0, y: 0},
                {x: radius, y: radius/2},
                {x: radius, y: -radius/2}
            ],
            {
                fill: translucent_color,
                strokeWidth: line_props['strokeWidth'], stroke: 'black',
                originX: 'left', originY: 'center',
                left: center[0] - half_line_width, top: center[1],
                centeredRotation: false,
            })
        let dot = get_center_circle()
        let group = new fabric.Group(
            [cone, dot],
            Object.assign(
                {originX: dot.radius/(dot.radius + radius)},
                group_props))
        group.setControlsVisibility(control_viz)
        canvas.add(group).setActiveObject(group)
    }
    cone_button.addEventListener('click', draw_cone)

    let line_button = document.getElementById('create_line')
    let draw_line = function() {
        redrawCanvas()
        let half_line_width = line_props['strokeWidth']/2
        let radius = radius_box.value*pixel_scale/feet_per_square
        let center = get_center_coords()
        let length = Math.min(window.innerWidth, window.innerHeight)/2

        let line = new fabric.Polygon(
            [
                {x: 0, y: -radius},
                {x: length, y: -radius},
                {x: length, y: radius},
                {x: 0, y: radius},
            ],
            {
                fill: translucent_color,
                strokeWidth: line_props['strokeWidth'], stroke: 'black',
                originX: 'left', originY: 'center',
                left: center[0] - half_line_width, top: center[1],
                centeredRotation: false,
            })
        let dot = get_center_circle()
        let group = new fabric.Group(
            [line, dot],
            Object.assign(
                {originX: dot.radius/(dot.radius + length)},
                group_props))
        group.setControlsVisibility(control_viz)
        canvas.add(group).setActiveObject(group)
    }
    line_button.addEventListener('click', draw_line)

    let smaller_button = document.getElementById('decrease_scale')
    let decrease_scale = function() {
        let factor = 1.25
        pixel_scale /= factor
        line_props['strokeWidth'] /= factor
        redrawCanvas()
    }
    smaller_button.addEventListener('click', decrease_scale)

    let larger_button = document.getElementById('increase_scale')
    let increase_scale = function() {
        let factor = Math.sqrt(1.25)
        pixel_scale *= factor
        line_props['strokeWidth'] *= factor
        redrawCanvas()
    }
    larger_button.addEventListener('click', increase_scale)

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', redrawCanvas, false)

    function redrawCanvas() {
        canvas.clear()
        canvas.setWidth(window.innerWidth)
        canvas.setHeight(window.innerHeight)
        canvas.calcOffset()
        draw_lines()
    }
    redrawCanvas()
}
