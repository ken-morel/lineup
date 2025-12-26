#pragma once
#include <gama.h>

void show_position(double x, double y, gmColor color) {
  char label_txt[50] = {0};
  snprintf(label_txt, sizeof(label_txt), "(%.2lf,%.2lf)", x, y);
  gm_draw_text(x, y, label_txt, "", 0.08, color);
}
