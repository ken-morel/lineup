#pragma once

#ifndef MAX_USER_POINTS
#define MAX_USER_POINTS 50
#endif

#include "utils.h"
#include <gama.h>

gmPos user_points[MAX_USER_POINTS];
size_t n_user_points = 0;
int selected_point = -1;

const double point_radius = 0.04;

void plot_user_points() {
  for (size_t i = 0; i < n_user_points; i++) {
    double x = user_points[i].x, y = user_points[i].y;
    double radius = gm_anim_sin(point_radius, 0.003, 1, (double)i / 5);
    gmColor color = selected_point == i ? GM_ORANGE : GM_LIGHTBLUE;
    gm_draw_circle(x, y, radius, gm_set_alpha(color, 100));
  }
}

void select_point(int id) { selected_point = id; }
void unselect_point() { selected_point = -1; }

void add_user_point(double x, double y) {
  if (n_user_points + 1 >= MAX_USER_POINTS) {
    fprintf(stderr, "Can not add any more points");
    return;
  }
  user_points[n_user_points].x = x;
  user_points[n_user_points].y = y;
  n_user_points++;
}

void find_selected_point() {
  for (size_t i = 0; i < n_user_points; i++) {
    if (gm_pos_distance(gm_mouse.position, user_points[i]) < point_radius) {
      select_point(i);
      return;
    }
  }
  unselect_point();
}

void delete_selected_point() {
  if (selected_point < 0)
    return;
  for (size_t i = selected_point; i < n_user_points - 1; i++)
    user_points[i] = user_points[i + 1];
  n_user_points--;
  unselect_point();
}

void show_selected_point_position() {
  if (selected_point < 0)
    return;
  double x = user_points[selected_point].x, y = user_points[selected_point].y;
  show_position(x, y, GM_GREENYELLOW);
}
