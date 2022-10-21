from datetime import datetime
import json
import subprocess

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado


class RouteHandler(APIHandler):

    def __init__(self, *args, **kwargs):
        self._cached_date = None
        super(RouteHandler, self).__init__(*args, **kwargs)


    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        data = ""
        if self._cached_date:
            data = self._cached_date
        else:
            result = subprocess.run(["squeue", "-w", "localhost", "-o", "%e", "--noheader"], stdout=subprocess.PIPE)
            output = result.stdout.decode().strip()
            try:
                date = datetime.strptime(output, "%Y-%m-%dT%H:%M:%S").astimezone()
                self._cached_date = date.isoformat()
                data = self._cached_date
            except ValueError:
                pass

        self.finish(json.dumps({
            "end_time": data
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "remaining-job-time", "stop-time")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
