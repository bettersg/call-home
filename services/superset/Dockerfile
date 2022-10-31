FROM apache/superset
# Switching to root to install the required packages
USER root
# Install the Postgres driver to connect to the metadata database
RUN pip install psycopg2-binary
# Switching back to using the `superset` user
USER superset
# Add configuration
COPY superset_config.py .

ENTRYPOINT "SUPERSET_PORT=${PORT} /usr/bin/docker-entrypoint.sh"
