import json
import tornado
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
from ._version import __version__
from .exceptions import APIError


class VersionHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        try:
            # Return the version of the package
            self.finish(json.dumps({"version": __version__}))

        except APIError as e:
            self.set_status(e.STATUS_CODE)
            self.finish(json.dumps({"message": str(e)}))


def setup_handlers(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    route_pattern = url_path_join(base_url, "jupyter-igv", "version")
    handlers = [(route_pattern, VersionHandler)]
    web_app.add_handlers(host_pattern, handlers)
