import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Link,
  Icon,
} from "@chakra-ui/core";
import SelectCarreras from "./SelectCarreras";
import SelectMateria from "./SelectMateria";
import { data } from "../data/horarios";
import { randomColor } from "../utils/colorHelper";

const MateriasDrawer = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = React.useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = React.useState([]);
  const [materiasVisibles, setMateriasVisibles] = React.useState([]);

  React.useEffect(() => {
    const materiasAMostrarConDups = carrerasSeleccionadas?.reduce(
      (arr, c) => arr.concat(...c.materias),
      []
    );
    const materiasAMostrar = new Set(materiasAMostrarConDups);

    const materias = materiasAMostrar.size
      ? data.materias.filter((m) => materiasAMostrar.has(m.index))
      : data.materias;
    setMateriasVisibles([...materias]);
  }, [carrerasSeleccionadas]);

  React.useEffect(() => {
    const events = cursosSeleccionados.map((curso) => {
      curso.color = curso.color || randomColor(10);
      return curso.clases.map((c) => {
        return {
          start: new Date(2018, 0, c.dia, c.inicio),
          end: new Date(2018, 0, c.dia, c.fin),
          title: curso.docentes,
          color: curso.color,
        };
      });
    });

    props.setEvents(events.flat());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursosSeleccionados]);

  const seleccionarCurso = (curso) => {
    if (cursosSeleccionados.includes(curso)) {
      const cursoWithoutMateria = cursosSeleccionados.filter(
        (el) => el.docentes !== curso.docentes
      );
      setCursosSeleccionados([...cursoWithoutMateria]);
    } else {
      setCursosSeleccionados([...cursosSeleccionados, curso]);
    }
  };

  return (
    <>
      {!isOpen && (
        <IconButton
          m={5}
          onClick={onOpen}
          variantColor="primary"
          aria-label="Agregar Materia"
          icon="add"
          color="background"
          borderColor="background"
          fontFamily="general"
        />
      )}

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="background">
          <DrawerBody>
            <SelectCarreras
              carreras={data.carreras}
              carrerasSeleccionadas={carrerasSeleccionadas}
              setCarrerasSeleccionadas={setCarrerasSeleccionadas}
            />

            <SelectMateria
              materiasVisibles={materiasVisibles}
              cursosSeleccionados={cursosSeleccionados}
              seleccionarCurso={seleccionarCurso}
            />
          </DrawerBody>
          <DrawerFooter>
            <Link
              isExternal
              color="primary.500"
              href="https://github.com/fdelmazo/FIUBA-Plan"
            >
              <Icon color="primary" name="github" />
            </Link>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MateriasDrawer;