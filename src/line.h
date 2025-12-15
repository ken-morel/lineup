#pragma once

#include "user_points.h"
#include <gama.h>

double gradient = 1, intercept = 0;

double loss = 0;
double learn_rate = 0.01;

static inline double find_y(double x) { return (gradient * x) + intercept; }

static inline double find_x(double y) { return (y - intercept) / gradient; }

void find_loss() {
  loss = 0;
  for (size_t i = 0; i < n_user_points; i++) {
    double error = find_y(user_points[i].x) - user_points[i].y;
    loss += fabs(error);
  }
}
void plot_line() {
  double start_x = -1, start_y = find_y(start_x);
  double end_x = 1, end_y = find_y(end_x);
  find_loss();
  int loss_on_256 = log(loss) + 100;
  gmColor color = gm_set_red(GM_YELLOW, loss_on_256);
  gm_draw_line(start_x, start_y, end_x, end_y, 0.02, color);
}

void one_epoch() {
  for (size_t i = 0; i < n_user_points; i++) {
    double error = find_y(user_points[i].x) - user_points[i].y;
    gradient -= learn_rate * user_points[i].x * error;
    intercept -= learn_rate * error;
  }
}
