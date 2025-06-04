#import "@preview/lilaq:0.3.0" as lq

#let dpi = float(sys.inputs.at("dpi", default: "1000"))

#let ipd = 1.0in / dpi

#let px(needed_px) = {
  return needed_px * ipd
}

#let fromcurrency = sys.inputs.at("from_currency", default: "RUB")
#let convcurrency = sys.inputs.at("conv_currency", default: "RUB")

#let width_px = float(sys.inputs.at("width", default: "600"))
#let height_px = width_px / 1.5

#let period = sys.inputs.at("period", default: "")
#let tick-distance = if period == "week" {
  60 * 60 * 24 * 7
} else if period == "month" {
  60 * 60 * 24 * 60
} else {
  auto
}

#let subticks = if period == "week" {
  7 - 1
} else if period == "month" {
  4 - 1
} else {
  auto
}

#let text_size = px(8 + (width_px * 0.01))
#set text(size: px(8 + (width_px * 0.01)))

#let x = json(bytes(sys.inputs.at("x", default: "[0, 1, 2]")))
#let y = json(bytes(sys.inputs.at("y", default: "[0, 1, 2]"))).map(el => float(el))


#show: lq.set-spine(stroke: px(3))
#show: lq.set-tick(stroke: px(1))
#show: lq.set-grid(stroke: px(2), stroke-sub: px(1) + luma(90%))
#show: lq.set-tick(stroke: px(1), inset: px(15))
#show: lq.set-legend(pad: px(30), inset: px(10), radius: px(10))

#let mark = lq.marks.at("*")

#let epoch = datetime(year: 1970, month: 01, day: 01, hour: 0, minute: 0, second: 0)
#let unix-to-datetime(stamp) = epoch + duration(seconds: int(stamp))

// #panic(calc.min(..y))



#set align(center + top)

#context {
  let diag = block(
    lq.diagram(
      width: px(width_px),
      height: px(height_px),
      yaxis: (
        label: [
          #set text(size: 1.5em)
          $convcurrency$
        ],
      ),
      xaxis: (
        // tick-distance: 60 * 60 * 24.0 * 30,
        tick-distance: tick-distance,
        subticks: subticks,
        format-ticks: (tick-info, exponent: none, offset: none, auto-exponent-threshold: none) => {
          return (
            tick-labels: tick-info.ticks.map(el => context [
              // #tick-distance.update(_ => tick-info.tick-distance)

              #set align(left + top)
              // #show: it => move(dx: 50%, it)
              #show: it => rotate(45deg, reflow: false, it)
              #let el = {
                let dt = unix-to-datetime(el)

                dt.display("[year]-[month]-[day]")
              }
              #let el_mes = measure(el)

              #move(dx: el_mes.width / 2, el)
            ]),
            exp: exponent,
            offset: offset,
          )
        },
      ),
      // ylim: (calc.min(..y), calc.max(..y)),

      lq.plot(
        x,
        y,
        mark: none,
        stroke: px(2 + width_px * 0.001),
        label: [
          $1 fromcurrency$
        ],
      ),
    ),
  )

  let diag_mes = measure(diag)

  set page(width: diag_mes.width + px(80), height: diag_mes.height + 6 * text_size, margin: (top: px(20)))


  diag
}
