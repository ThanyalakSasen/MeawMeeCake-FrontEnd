import React from "react";
import { BsTrash, BsPlus } from "react-icons/bs";
import { SelectInput } from "../../../../components/selectInput";

export default function MethodSection({
  methodsList,
  onMethodMainTopicChange,
  onMethodSubTopicChange,
  onAddMethodSubTopic,
  onRemoveMethodSubTopic,
  onAddMethod,
  onRemoveMethod,
  methodLabel = "วิธีการทำ",
  mainTopicLabel = "หัวข้อหลัก",
  subTopicLabel = "หัวข้อย่อย",
  addSubTopicLabel = "เพิ่มหัวข้อย่อย",
  addMainTopicLabel = "เพิ่มหัวข้อหลัก",
  removeMethodLabel = "ลบหัวข้อหลัก",
  emptyText = "ยังไม่มีวิธีการทำ",
  mainTopicEmptyLabel = "ยังไม่มีหัวข้อหลัก",
  mainTopicOptions = [],
  subTopicOptions = [],
}) {
  const hasMethods = methodsList.length > 0;

  return (
    <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
      <table className="table table-striped align-middle border caption-top">
        <thead>
          <tr>
            <th colSpan={3}>{methodLabel}</th>
          </tr>
          <tr>
            <th style={{ width: "35%" }}>{mainTopicLabel}</th>
            <th style={{ width: "50%" }}>{subTopicLabel}</th>
            <th style={{ width: "15%" }}></th>
          </tr>
        </thead>

        <tbody>
          {hasMethods ? (
            methodsList.map((method) => {
              const canRemoveMethod = (method.subTopics?.length ?? 0) === 0;

              return (
              <tr key={method.id}>
                <td className="align-top">
                  <div className="d-flex justify-content-start align-items-start">
                    <SelectInput
                      value={method.mainTopic}
                      options={mainTopicOptions}
                      onChange={(e) =>
                        onMethodMainTopicChange(method.id, e.target.value)
                      }
                    />
                  </div>
                </td>
                <td>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {(method.subTopics?.length ?? 0) > 0 ? (
                      method.subTopics?.map((subTopic, subTopicIndex) => (
                        <div
                          key={`${method.id}-${subTopicIndex}`}
                          className="d-flex align-items-center"
                          style={{ gap: "0.5rem" }}
                        >
                          <div className="flex-grow-1">
                            <SelectInput
                              value={subTopic}
                              options={subTopicOptions}
                              onChange={(e) =>
                                onMethodSubTopicChange(
                                  method.id,
                                  subTopicIndex,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <BsTrash
                            size={18}
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              onRemoveMethodSubTopic(method.id, subTopicIndex)
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-muted text-center">{mainTopicEmptyLabel}</div>
                    )}

                    <div className="d-flex justify-content-end pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => onAddMethodSubTopic(method.id)}
                      >
                        <BsPlus size={18} />
                        {addSubTopicLabel}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="align-middle text-center">
                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      type="button"
                      className={`btn d-flex align-items-center gap-1 ${
                        canRemoveMethod
                          ? "btn-outline-danger"
                          : "btn-outline-secondary text-secondary"
                      }`}
                      onClick={() => onRemoveMethod(method.id)}
                      disabled={!canRemoveMethod}
                    >
                      <BsTrash size={18} />
                      <span>{removeMethodLabel}</span>
                    </button>
                  </div>
                </td>
              </tr>
            );})
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                <div className="mb-2">{emptyText}</div>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={onAddMethod}
                >
                  <BsPlus size={18} />
                  {addMainTopicLabel}
                </button>
              </td>
            </tr>
          )}
        </tbody>

        {hasMethods && (
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={onAddMethod}
                >
                  <BsPlus size={18} />
                  {addMainTopicLabel}
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
