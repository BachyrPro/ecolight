FROM jenkins/jenkins:lts

USER root

# Installer Docker + autres outils
RUN apt-get update && apt-get install -y docker.io curl git && \
    groupadd -f docker && usermod -aG docker jenkins && \
    rm -rf /var/lib/apt/lists/*

# Installer Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/v2.17.3/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose

USER jenkins
