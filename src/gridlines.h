#include "color.h"
#include <gama.h>

void draw_gridlines() {
  char label[5];
  gmColor transparent_white = gm_set_alpha(GM_WHITE, 100);
  gmColor more_transparent_white = gm_set_alpha(GM_WHITESMOKE, 20);
  // x axis
  gm_draw_line(-5, 0, 5, 0, 0.005, transparent_white);
  for (double x = -5; x <= 5; x += 0.1) {
    gm_draw_line(x, -5, x, 5, 0.01, more_transparent_white);
    // draw indicator line
    int ishalf = (int)(x * 10) % 5 == 0;
    sprintf(label, "%.1lf", x);
    gm_draw_line(x, 0, x, ishalf ? -0.04 : -0.02, ishalf ? 0.01 : 0.005,
                 transparent_white);
    gm_draw_text(x, ishalf ? -0.09 : -0.07, label, "", 0.05, transparent_white);
  }
  // y axis
  gm_draw_line(0, -5, 0, 5, 0.005, transparent_white);

  for (double y = -5; y <= 5; y += 0.1) {
    gm_draw_line(-5, y, 5, y, 0.01, more_transparent_white);
    // draw indicator line
    int ishalf = (int)(y * 10) % 5 == 0;
    sprintf(label, "%.1lf", y);
    gm_draw_line(0, y, ishalf ? -0.04 : -0.02, y, ishalf ? 0.01 : 0.005,
                 transparent_white);
    gm_draw_text(ishalf ? -0.09 : -0.07, y, label, "", 0.05, transparent_white);
  }
}
